import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const customFolder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // Validate MIME type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniquePath = `${customFolder}/${Date.now()}-${cleanFileName}`;

    if (supabase) {
      // 1. Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(uniquePath, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        console.error("Supabase storage upload error:", error);
        throw new Error(error.message);
      }

      // 2. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(uniquePath);

      return NextResponse.json({
        success: true,
        url: publicUrlData.publicUrl,
        path: uniquePath,
      });
    } else {
      // Fallback base64 data URL if Supabase client not initialized
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        url: base64,
        path: uniquePath,
      });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image." },
      { status: 500 }
    );
  }
}
