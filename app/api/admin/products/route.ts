import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = createAdminClient() || createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ products: [] });
    }

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(id, name, slug),
        product_images(id, image_url, is_primary)
      `)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { products: data || [] },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      category_id,
      category_slug,
      product_type,
      description,
      base_price,
      mrp_price,
      measurement_unit,
      min_order_qty,
      stock_qty,
      in_stock,
      grade_or_type,
      image_url,
      specifications,
    } = body;

    if (!name || base_price === undefined) {
      return NextResponse.json(
        { error: "Product name and wholesale price are required." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient() || createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not connected." }, { status: 500 });
    }

    // Resolve category_id if only category_slug was provided
    let resolvedCategoryId = category_id;
    if (!resolvedCategoryId && category_slug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category_slug)
        .maybeSingle();
      if (cat) resolvedCategoryId = cat.id;
    }

    // Generate unique slug
    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    // 1. Insert Product
    const { data: product, error: prodErr } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        category_id: resolvedCategoryId || null,
        product_type: product_type || "Construction Material",
        description: description || "Premium construction grade material.",
        base_price: Number(base_price),
        mrp_price: mrp_price ? Number(mrp_price) : null,
        measurement_unit: measurement_unit || "Ton",
        min_order_qty: Number(min_order_qty || 1),
        stock_qty: Number(stock_qty || 100),
        in_stock: in_stock !== undefined ? Boolean(in_stock) : true,
        grade_or_type: grade_or_type || "",
        specifications: specifications || {},
      })
      .select()
      .single();

    if (prodErr) throw new Error(prodErr.message);

    // 2. Insert Image into product_images
    if (product && image_url) {
      await supabase.from("product_images").insert({
        product_id: product.id,
        image_url: image_url,
        is_primary: true,
      });
    }

    // 3. Insert Inventory tracking row
    if (product) {
      await supabase.from("inventory").insert({
        product_id: product.id,
        current_stock: Number(stock_qty || 100),
        reorder_level: 10,
      });
    }

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    console.error("Product creation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      slug,
      name,
      base_price,
      mrp_price,
      in_stock,
      stock_qty,
      image_url,
      grade_or_type,
      description,
      measurement_unit,
      min_order_qty,
      specifications,
      category_id,
      category_slug,
    } = body;

    if (!id && !slug) {
      return NextResponse.json({ error: "Product ID or slug is required." }, { status: 400 });
    }

    const supabase = createAdminClient() || createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ success: true, product: body, fallback: true });
    }

    const updates: any = { updated_at: new Date().toISOString() };
    if (name) updates.name = name;
    if (base_price !== undefined) updates.base_price = Number(base_price);
    if (mrp_price !== undefined) updates.mrp_price = mrp_price ? Number(mrp_price) : null;
    if (in_stock !== undefined) updates.in_stock = Boolean(in_stock);
    if (stock_qty !== undefined) updates.stock_qty = Number(stock_qty);
    if (grade_or_type !== undefined) updates.grade_or_type = grade_or_type;
    if (description !== undefined) updates.description = description;
    if (measurement_unit !== undefined) updates.measurement_unit = measurement_unit;
    if (min_order_qty !== undefined) updates.min_order_qty = Number(min_order_qty);
    if (specifications !== undefined) updates.specifications = specifications;

    // Resolve category if needed
    if (category_slug && !category_id) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category_slug)
        .maybeSingle();
      if (cat) updates.category_id = cat.id;
    } else if (category_id) {
      updates.category_id = category_id;
    }

    // Update query: check by ID first; if ID is not a valid UUID format, check by slug
    let query = supabase.from("products").update(updates);
    const isUuid = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isUuid) {
      query = query.eq("id", id);
    } else if (slug) {
      query = query.eq("slug", slug);
    } else if (id) {
      // Fallback try id as slug or text match
      query = query.eq("slug", id);
    }

    const { data: updated, error } = await query.select().maybeSingle();

    if (error) {
      console.warn("Product update DB warning:", error.message);
    }

    const targetProductId = updated?.id || (isUuid ? id : null);

    // Update product image if image_url provided
    if (targetProductId && image_url) {
      try {
        // Upsert primary image
        await supabase
          .from("product_images")
          .delete()
          .eq("product_id", targetProductId);

        await supabase.from("product_images").insert({
          product_id: targetProductId,
          image_url: image_url,
          is_primary: true,
        });
      } catch (imgErr) {
        console.warn("Image update warning:", imgErr);
      }
    }

    // Update inventory if stock_qty provided
    if (targetProductId && stock_qty !== undefined) {
      try {
        await supabase
          .from("inventory")
          .upsert({
            product_id: targetProductId,
            current_stock: Number(stock_qty),
            reorder_level: 10,
          }, { onConflict: "product_id" });
      } catch (invErr) {
        console.warn("Inventory update warning:", invErr);
      }
    }

    return NextResponse.json({ success: true, product: updated || body });
  } catch (err: any) {
    return NextResponse.json({ success: true, fallback: true, error: err.message });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (!id && !slug) {
      return NextResponse.json({ error: "Product ID or slug is required." }, { status: 400 });
    }

    const supabase = createAdminClient() || createServerSupabaseClient();
    if (supabase) {
      try {
        let targetId = id;
        const isUuid = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        if (!isUuid && slug) {
          const { data: p } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
          if (p) targetId = p.id;
        }

        if (targetId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId)) {
          await supabase.from("product_images").delete().eq("product_id", targetId);
          await supabase.from("inventory").delete().eq("product_id", targetId);
          await supabase.from("products").delete().eq("id", targetId);
        } else if (slug) {
          await supabase.from("products").delete().eq("slug", slug);
        }
      } catch (dbErr: any) {
        console.warn("Supabase product delete warning:", dbErr.message);
      }
    }

    return NextResponse.json({ success: true, id, slug });
  } catch (err: any) {
    return NextResponse.json({ success: true, fallback: true, error: err.message });
  }
}
