import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PRODUCTS_DATA } from "@/lib/data/products";
import { Product, MeasurementUnit } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = createAdminClient() || createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ products: PRODUCTS_DATA, source: "static" });
    }

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(id, name, slug),
        product_images(id, image_url, is_primary)
      `)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("Supabase fetch fallback to PRODUCTS_DATA:", error?.message);
      return NextResponse.json({ products: PRODUCTS_DATA, source: "fallback" });
    }

    // Filter out removed electrical/lighting products from DB data
    const filteredDbData = (data || []).filter((p: any) => {
      const slug = (p.slug || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      const catSlug = (p.categories?.slug || "").toLowerCase();
      const isElectrical =
        catSlug === "electricals" ||
        catSlug === "other-materials" ||
        slug.includes("polycab") ||
        slug.includes("copper-wire") ||
        slug.includes("switch") ||
        slug.includes("elec-") ||
        name.includes("polycab") ||
        name.includes("copper wire");
      return !isElectrical;
    });

    // Map DB rows to canonical Product shape
    const products: Product[] = filteredDbData.map((p: any) => {
      // Find matching static fallback if images or specs need enriching
      const staticMatch = PRODUCTS_DATA.find((sp) => sp.slug === p.slug || sp.id === p.id);

      const dbImages = (p.product_images || [])
        .map((img: any) => img.image_url)
        .filter(Boolean);

      // Filter out old unwanted demo unsplash photos
      const validDbImages = dbImages.filter(
        (url: string) =>
          !url.includes("photo-1600585154340") &&
          !url.includes("photo-1541888946425") &&
          !url.includes("photo-1584467735871")
      );

      // Check if DB image is an old generic placeholder or mismatched test upload
      const isPlaceholderOrMismatched =
        validDbImages.length === 0 ||
        validDbImages.every((url: string) =>
          url === "/images/products/cement-bags.jpg" ||
          url === "/images/products/cement-brands.jpg" ||
          url.includes("1795438739083-1000067793.png")
        );

      const finalImages =
        !isPlaceholderOrMismatched && validDbImages.length > 0
          ? validDbImages
          : staticMatch?.images && staticMatch.images.length > 0
          ? staticMatch.images
          : validDbImages.length > 0
          ? validDbImages
          : ["/images/products/river-sand.jpg"];

      // Normalize category slug and name to match Builders9 primary categories
      const rawCatSlug = (staticMatch?.categorySlug || p.categories?.slug || "sand").toLowerCase();
      let normalizedCategorySlug = rawCatSlug;
      let normalizedCategoryName = staticMatch?.categoryName || p.categories?.name || "River Sand & M-Sand";

      if (
        rawCatSlug === "sand" ||
        rawCatSlug === "river-sand" ||
        rawCatSlug === "m-sand" ||
        rawCatSlug === "plastering-sand"
      ) {
        normalizedCategorySlug = "sand";
        normalizedCategoryName = "River Sand & M-Sand";
      } else if (rawCatSlug === "aggregates" || rawCatSlug === "gravel") {
        normalizedCategorySlug = "aggregates";
        normalizedCategoryName = "Blue Metal Aggregates";
      } else if (rawCatSlug === "cement") {
        normalizedCategorySlug = "cement";
        normalizedCategoryName = "Cement";
      } else if (rawCatSlug === "steel") {
        normalizedCategorySlug = "steel";
        normalizedCategoryName = "TMT Steel Bars";
      } else if (rawCatSlug === "bricks") {
        normalizedCategorySlug = "bricks";
        normalizedCategoryName = "Bricks & Blocks";
      } else if (rawCatSlug === "stones") {
        normalizedCategorySlug = "stones";
        normalizedCategoryName = "Stones & Foundation";
      } else if (rawCatSlug === "red-soil") {
        normalizedCategorySlug = "red-soil";
        normalizedCategoryName = "Red Soil & Landscaping";
      }

      return {
        id: p.id,
        name: p.name,
        slug: p.slug || staticMatch?.slug || p.id,
        categorySlug: normalizedCategorySlug,
        categoryName: normalizedCategoryName,
        productType: p.product_type || staticMatch?.productType || "Building Material",
        description: p.description || staticMatch?.description || "High-grade verified building material.",
        price: Number(p.base_price !== undefined ? p.base_price : (staticMatch?.price || 0)),
        mrpPrice: p.mrp_price ? Number(p.mrp_price) : staticMatch?.mrpPrice,
        unit: (p.measurement_unit || staticMatch?.unit || "Ton") as MeasurementUnit,
        minOrderQuantity: Number(p.min_order_qty || staticMatch?.minOrderQuantity || 1),
        inStock: p.in_stock !== undefined ? Boolean(p.in_stock) : (staticMatch?.inStock ?? true),
        stockQuantity: Number(p.stock_qty !== undefined ? p.stock_qty : (staticMatch?.stockQuantity || 100)),
        images: finalImages,
        gradeOrType: p.grade_or_type || staticMatch?.gradeOrType || "",
        specifications: p.specifications && Object.keys(p.specifications).length > 0
          ? p.specifications
          : (staticMatch?.specifications || {}),
      };
    });

    // Merge any static products that are not in the DB so all catalog categories are complete
    const dbSlugs = new Set(products.map((p) => p.slug));
    const missingStaticProducts = PRODUCTS_DATA.filter((sp) => !dbSlugs.has(sp.slug));
    const finalProductsList = [...products, ...missingStaticProducts];

    return NextResponse.json(
      { products: finalProductsList, source: "database", count: finalProductsList.length },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    console.error("Public products API error:", err);
    return NextResponse.json({ products: PRODUCTS_DATA, source: "error-fallback" });
  }
}
