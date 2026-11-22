import { NextResponse } from "next/server";
import { createGuestOrder } from "@/lib/supabase/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.customerPhone || !body.deliveryAddress) {
      return NextResponse.json(
        { error: "Customer name, phone, and delivery address are required." },
        { status: 400 }
      );
    }

    const result = await createGuestOrder(body);

    return NextResponse.json({
      success: true,
      orderReference: result.orderReference,
      mode: result.mode,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process order" },
      { status: 500 }
    );
  }
}
