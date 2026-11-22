import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { orderReference, customerPhone } = await request.json();

    if (!customerPhone) {
      return NextResponse.json(
        { error: "Registered mobile number is required." },
        { status: 400 }
      );
    }

    const cleanPhone = customerPhone.replace(/\D/g, "");
    const supabase = createAdminClient() || createServerSupabaseClient();

    if (!supabase) {
      // Return simulated sample if DB credentials not yet configured
      return NextResponse.json({
        success: true,
        order: {
          orderReference: orderReference || "JBM-2026-SAMPLE",
          customerName: "Verified Site Customer",
          customerPhone: customerPhone,
          bookingDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          status: "Processing Tipper Dispatch",
          deliveryAddress: "Site Delivery Address on File",
          materials: [
            { name: "Triple-Washed River Sand (Grade A)", quantity: "16 Tons (1 Tipper)", rate: "₹29,600" },
          ],
          subtotal: "₹29,600",
          vehicleType: "10-Wheeler Tipper",
        },
      });
    }

    let query = supabase
      .from("orders")
      .select(`
        *,
        order_items(*)
      `)
      .ilike("customer_phone", `%${cleanPhone}%`);

    if (orderReference && orderReference.trim()) {
      query = query.eq("order_reference", orderReference.trim().toUpperCase());
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(1).single();

    if (error || !data) {
      return NextResponse.json(
        { error: "No booking found matching this mobile number and reference ID." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderReference: data.order_reference,
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        bookingDate: new Date(data.created_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: data.order_status,
        deliveryAddress: data.delivery_address,
        materials: data.order_items?.map((item: any) => ({
          name: item.product_name,
          quantity: `${item.quantity} ${item.measurement_unit}`,
          rate: `₹${item.total_price}`,
        })) || [],
        subtotal: `₹${data.subtotal_amount}`,
        vehicleType: data.assigned_vehicle || "10-Wheeler Tipper (Assigning)",
      },
    });
  } catch (err: any) {
    console.error("Order tracking error:", err);
    return NextResponse.json(
      { error: "Unable to retrieve order. Please verify your phone number." },
      { status: 500 }
    );
  }
}
