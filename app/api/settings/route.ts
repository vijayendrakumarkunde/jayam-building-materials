import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BRAND_INFO } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface UpiMeta {
  upiId?: string;
  alternateUpiId?: string;
  merchantName?: string;
}

function parseDeliveryNoticeAndMeta(rawNotice: string | null | undefined): {
  cleanNotice: string;
  upiMeta: UpiMeta;
} {
  if (!rawNotice) {
    return {
      cleanNotice: BRAND_INFO.deliveryNotice,
      upiMeta: {
        upiId: BRAND_INFO.upiId,
        alternateUpiId: BRAND_INFO.alternateUpiId,
        merchantName: BRAND_INFO.merchantName,
      },
    };
  }

  let upiMeta: UpiMeta = {};
  const metaMatch = rawNotice.match(/<!-- UPI_META:\s*({[\s\S]*?})\s*-->/);
  if (metaMatch && metaMatch[1]) {
    try {
      upiMeta = JSON.parse(metaMatch[1]);
    } catch (e) {
      console.warn("Failed to parse embedded UPI metadata from delivery notice:", e);
    }
  }

  const cleanNotice = rawNotice.replace(/<!-- UPI_META:[\s\S]*?-->/g, "").trim();

  return {
    cleanNotice: cleanNotice || BRAND_INFO.deliveryNotice,
    upiMeta: {
      upiId: upiMeta.upiId || BRAND_INFO.upiId,
      alternateUpiId: upiMeta.alternateUpiId || BRAND_INFO.alternateUpiId,
      merchantName: upiMeta.merchantName || BRAND_INFO.merchantName,
    },
  };
}

export async function GET() {
  try {
    const supabase = createAdminClient() || createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        settings: {
          businessName: BRAND_INFO.name,
          name: BRAND_INFO.name,
          tagline: BRAND_INFO.tagline,
          phone: BRAND_INFO.phone,
          whatsapp: BRAND_INFO.whatsappNumber,
          whatsappNumber: BRAND_INFO.whatsappNumber,
          address: BRAND_INFO.address,
          operatingHours: BRAND_INFO.operatingHours,
          deliveryNotice: BRAND_INFO.deliveryNotice,
          upiId: BRAND_INFO.upiId,
          alternateUpiId: BRAND_INFO.alternateUpiId,
          merchantName: BRAND_INFO.merchantName,
        },
      });
    }

    const { data, error } = await supabase
      .from("website_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({
        settings: {
          businessName: BRAND_INFO.name,
          name: BRAND_INFO.name,
          tagline: BRAND_INFO.tagline,
          phone: BRAND_INFO.phone,
          whatsapp: BRAND_INFO.whatsappNumber,
          whatsappNumber: BRAND_INFO.whatsappNumber,
          address: BRAND_INFO.address,
          operatingHours: BRAND_INFO.operatingHours,
          deliveryNotice: BRAND_INFO.deliveryNotice,
          upiId: BRAND_INFO.upiId,
          alternateUpiId: BRAND_INFO.alternateUpiId,
          merchantName: BRAND_INFO.merchantName,
        },
      });
    }

    const { cleanNotice, upiMeta } = parseDeliveryNoticeAndMeta(data.delivery_notice);

    const formattedSettings = {
      id: data.id,
      businessName: data.business_name || BRAND_INFO.name,
      name: data.business_name || BRAND_INFO.name,
      tagline: data.tagline || BRAND_INFO.tagline,
      phone: data.business_phone || BRAND_INFO.phone,
      whatsapp: data.whatsapp_number || BRAND_INFO.whatsappNumber,
      whatsappNumber: data.whatsapp_number || BRAND_INFO.whatsappNumber,
      address: data.physical_address || BRAND_INFO.address,
      operatingHours: data.operating_hours || BRAND_INFO.operatingHours,
      deliveryNotice: cleanNotice,
      upiId: upiMeta.upiId || BRAND_INFO.upiId,
      alternateUpiId: upiMeta.alternateUpiId || BRAND_INFO.alternateUpiId,
      merchantName: upiMeta.merchantName || BRAND_INFO.merchantName,
      updatedAt: data.updated_at,
    };

    return NextResponse.json(
      { settings: formattedSettings },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (err: any) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json(
      {
        settings: {
          businessName: BRAND_INFO.name,
          name: BRAND_INFO.name,
          tagline: BRAND_INFO.tagline,
          phone: BRAND_INFO.phone,
          whatsapp: BRAND_INFO.whatsappNumber,
          whatsappNumber: BRAND_INFO.whatsappNumber,
          address: BRAND_INFO.address,
          operatingHours: BRAND_INFO.operatingHours,
          deliveryNotice: BRAND_INFO.deliveryNotice,
          upiId: BRAND_INFO.upiId,
          alternateUpiId: BRAND_INFO.alternateUpiId,
          merchantName: BRAND_INFO.merchantName,
        },
        error: err.message,
      },
      { status: 200 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createAdminClient() || createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client unavailable" }, { status: 500 });
    }

    const body = await request.json();
    const {
      businessName,
      name,
      tagline,
      phone,
      whatsapp,
      whatsappNumber,
      address,
      operatingHours,
      deliveryNotice,
      upiId,
      alternateUpiId,
      merchantName,
    } = body;

    const finalBusinessName = (businessName || name || BRAND_INFO.name).trim();
    const finalTagline = (tagline || BRAND_INFO.tagline).trim();
    const finalPhone = (phone || BRAND_INFO.phone).trim();
    const finalWhatsapp = (whatsapp || whatsappNumber || BRAND_INFO.whatsappNumber).trim();
    const finalAddress = (address || BRAND_INFO.address).trim();
    const finalHours = (operatingHours || BRAND_INFO.operatingHours).trim();
    const rawDeliveryNotice = (deliveryNotice || BRAND_INFO.deliveryNotice).trim();

    // Package UPI configuration cleanly into delivery_notice metadata
    const cleanNotice = rawDeliveryNotice.replace(/<!-- UPI_META:[\s\S]*?-->/g, "").trim();
    const metaPayload: UpiMeta = {
      upiId: (upiId || BRAND_INFO.upiId).trim(),
      alternateUpiId: (alternateUpiId || BRAND_INFO.alternateUpiId).trim(),
      merchantName: (merchantName || BRAND_INFO.merchantName).trim(),
    };
    const deliveryNoticeWithMeta = `${cleanNotice}\n<!-- UPI_META: ${JSON.stringify(metaPayload)} -->`;

    const updatePayload = {
      business_name: finalBusinessName,
      business_phone: finalPhone,
      whatsapp_number: finalWhatsapp,
      tagline: finalTagline,
      physical_address: finalAddress,
      operating_hours: finalHours,
      delivery_notice: deliveryNoticeWithMeta,
      updated_at: new Date().toISOString(),
    };

    // Find existing row ID
    const { data: existingRow } = await supabase
      .from("website_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    let savedData = null;

    if (existingRow && existingRow.id) {
      const { data, error } = await supabase
        .from("website_settings")
        .update(updatePayload)
        .eq("id", existingRow.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      savedData = data;
    } else {
      const { data, error } = await supabase
        .from("website_settings")
        .insert(updatePayload)
        .select()
        .single();

      if (error) throw new Error(error.message);
      savedData = data;
    }

    const { cleanNotice: parsedNotice, upiMeta: parsedMeta } = parseDeliveryNoticeAndMeta(
      savedData?.delivery_notice
    );

    const responseSettings = {
      id: savedData?.id,
      businessName: savedData?.business_name || finalBusinessName,
      name: savedData?.business_name || finalBusinessName,
      tagline: savedData?.tagline || finalTagline,
      phone: savedData?.business_phone || finalPhone,
      whatsapp: savedData?.whatsapp_number || finalWhatsapp,
      whatsappNumber: savedData?.whatsapp_number || finalWhatsapp,
      address: savedData?.physical_address || finalAddress,
      operatingHours: savedData?.operating_hours || finalHours,
      deliveryNotice: parsedNotice,
      upiId: parsedMeta.upiId || metaPayload.upiId,
      alternateUpiId: parsedMeta.alternateUpiId || metaPayload.alternateUpiId,
      merchantName: parsedMeta.merchantName || metaPayload.merchantName,
      updatedAt: savedData?.updated_at,
    };

    return NextResponse.json({
      success: true,
      message: "Website yard details and payment settings saved successfully to Supabase!",
      settings: responseSettings,
    });
  } catch (err: any) {
    console.error("PUT /api/settings error:", err);
    return NextResponse.json({ error: err.message || "Failed to update settings" }, { status: 500 });
  }
}

// Allow POST as alias to PUT
export async function POST(request: Request) {
  return PUT(request);
}
