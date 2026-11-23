import { createServerSupabaseClient } from "./server";
import { createAdminClient } from "./admin";
import { PRODUCTS_DATA } from "../data/products";
import { CATEGORIES_DATA } from "../data/categories";
import { Product, Category, CartItem } from "../types";

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) return CATEGORIES_DATA;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return CATEGORIES_DATA;
    }

    return data.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      imageUrl: cat.image_url || "",
      itemCount: 4,
      featured: true,
    }));
  } catch (err) {
    console.error("Supabase getCategories fallback:", err);
    return CATEGORIES_DATA;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) return PRODUCTS_DATA;

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name, slug),
        product_images(image_url, is_primary)
      `)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return PRODUCTS_DATA;
    }

    return data.map((p: any) => {
      const images = p.product_images && p.product_images.length > 0
        ? p.product_images.map((img: any) => img.image_url)
        : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"];

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        categorySlug: p.categories?.slug || "general",
        categoryName: p.categories?.name || "General Material",
        productType: p.product_type || "Construction Material",
        description: p.description || "",
        price: Number(p.base_price),
        unit: p.measurement_unit as any,
        minOrderQuantity: Number(p.min_order_qty),
        inStock: Boolean(p.in_stock),
        stockQuantity: Number(p.stock_qty),
        images,
        isFeatured: Boolean(p.is_featured),
        isBestseller: Boolean(p.is_bestseller),
        specifications: p.specifications || {},
        gradeOrType: p.grade_or_type,
      };
    });
  } catch (err) {
    console.error("Supabase getProducts fallback:", err);
    return PRODUCTS_DATA;
  }
}

export async function createGuestOrder(orderPayload: {
  orderReference: string;
  customerName: string;
  customerPhone: string;
  alternatePhone?: string;
  deliveryAddress: string;
  landmark?: string;
  city?: string;
  roadAccess?: string;
  preferredDate?: string;
  specialInstructions?: string;
  subtotal: number;
  items: CartItem[];
  paymentMethod?: string;
  paymentStatus?: string;
  utrNumber?: string;
  tokenAmount?: number;
}) {
  const supabase = createAdminClient() || createServerSupabaseClient();
  if (!supabase) {
    return { success: true, orderReference: orderPayload.orderReference, mode: "local" };
  }

  // 1. Upsert customer
  const { data: customerData } = await supabase
    .from("customers")
    .upsert({
      full_name: orderPayload.customerName,
      phone: orderPayload.customerPhone,
      alternate_phone: orderPayload.alternatePhone,
      default_address: orderPayload.deliveryAddress,
    }, { onConflict: "phone" })
    .select("id")
    .single();

  const customerId = customerData?.id || null;

  // Format special instructions to include payment details
  const formattedInstructions = [
    orderPayload.specialInstructions,
    orderPayload.paymentMethod ? `[Payment: ${orderPayload.paymentMethod}]` : null,
    orderPayload.tokenAmount ? `[Token Deposit: ₹${orderPayload.tokenAmount}]` : null,
    orderPayload.utrNumber ? `[UPI UTR: ${orderPayload.utrNumber}]` : null,
  ].filter(Boolean).join(" | ");

  // 2. Insert Order
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_reference: orderPayload.orderReference,
      customer_id: customerId,
      customer_name: orderPayload.customerName,
      customer_phone: orderPayload.customerPhone,
      alternate_phone: orderPayload.alternatePhone,
      delivery_address: orderPayload.deliveryAddress,
      landmark: orderPayload.landmark,
      city: orderPayload.city || "Hyderabad Region",
      road_access: orderPayload.roadAccess,
      preferred_date: orderPayload.preferredDate,
      special_instructions: formattedInstructions,
      subtotal_amount: orderPayload.subtotal,
      order_status: "Pending",
    })
    .select("id")
    .single();

  if (orderError) {
    throw new Error(orderError.message);
  }

  // 3. Insert Order Items
  if (orderData && orderPayload.items.length > 0) {
    const orderItemsToInsert = orderPayload.items.map((item) => ({
      order_id: orderData.id,
      product_name: item.product.name,
      measurement_unit: item.product.unit,
      quantity: item.quantity,
      unit_price: item.product.price,
      total_price: item.product.price * item.quantity,
    }));

    await supabase.from("order_items").insert(orderItemsToInsert);
  }

  // 4. Create Admin Notification
  await supabase.from("notifications").insert({
    title: `New Order ${orderPayload.orderReference}`,
    message: `${orderPayload.customerName} booked ${orderPayload.items.length} materials (₹${orderPayload.subtotal}) - ${orderPayload.paymentMethod || "Pay on Site"}.`,
    notification_type: "order",
    link_url: `/admin/orders`,
  });

  return { success: true, orderReference: orderPayload.orderReference, mode: "supabase" };
}
