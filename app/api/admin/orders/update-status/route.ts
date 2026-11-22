import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { orderId, newStatus, assignedVehicle } = await request.json();

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { error: "Order ID and new status are required." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient() || createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ success: true, message: "Local mock status updated." });
    }

    const updatePayload: any = {
      order_status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (assignedVehicle) {
      updatePayload.assigned_vehicle = assignedVehicle;
    }

    const { data, error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Add notification
    await supabase.from("notifications").insert({
      title: `Order Status Changed: ${newStatus}`,
      message: `Order ${data.order_reference} status changed to ${newStatus}.`,
      notification_type: "order",
      link_url: "/admin/orders",
    });

    return NextResponse.json({ success: true, order: data });
  } catch (err: any) {
    console.error("Status update error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update order status." },
      { status: 500 }
    );
  }
}
