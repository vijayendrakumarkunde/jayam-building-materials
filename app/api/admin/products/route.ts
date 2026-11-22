import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

    return NextResponse.json({ products: data || [] });
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
      product_type,
      description,
      base_price,
      measurement_unit,
      min_order_qty,
      stock_qty,
      in_stock,
      grade_or_type,
      image_url,
      specifications,
    } = body;

    if (!name || !base_price || !measurement_unit) {
      return NextResponse.json(
        { error: "Product name, wholesale price, and measurement unit are required." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient() || createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not connected." }, { status: 500 });
    }

    // Slug generation
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    // 1. Insert Product
    const { data: product, error: prodErr } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        category_id: category_id || null,
        product_type: product_type || "Construction Material",
        description: description || "",
        base_price: Number(base_price),
        measurement_unit: measurement_unit || "Ton",
        min_order_qty: Number(min_order_qty || 1),
        stock_qty: Number(stock_qty || 100),
        in_stock: in_stock !== undefined ? in_stock : true,
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
    const { id, base_price, in_stock, stock_qty, image_url, name } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const supabase = createAdminClient() || createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not connected." }, { status: 500 });
    }

    const updates: any = { updated_at: new Date().toISOString() };
    if (base_price !== undefined) updates.base_price = Number(base_price);
    if (in_stock !== undefined) updates.in_stock = in_stock;
    if (stock_qty !== undefined) updates.stock_qty = Number(stock_qty);
    if (name) updates.name = name;

    const { data: updated, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Update image if new image URL provided
    if (image_url) {
      await supabase
        .from("product_images")
        .upsert({
          product_id: id,
          image_url: image_url,
          is_primary: true,
        }, { onConflict: "product_id" });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
