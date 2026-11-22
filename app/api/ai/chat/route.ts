import { NextResponse } from "next/server";
import { calculateSlabMaterials, calculatePlasteringMaterials } from "@/lib/utils/calculator";
import { PRODUCTS_DATA } from "@/lib/data/products";
import { BRAND_INFO } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const lower = message.toLowerCase();

    // 1. DELIVERY & TRANSPORT POLICY
    if (lower.includes("delivery") || lower.includes("deliver") || lower.includes("transport") || lower.includes("freight") || lower.includes("charge") || lower.includes("unloading")) {
      return NextResponse.json({
        reply: `🚛 **Transparent Delivery & Transport Policy**:\n\n` +
          `• **No Hidden Automatic Charges**: We do not charge arbitrary delivery fees at checkout.\n` +
          `• **Actual Vehicle Distance Freight**: Transport is calculated based on exact kilometres from our depot to your site unloading point.\n` +
          `• **Fleet Options**: We operate 10-Wheeler Hydraulic Tippers (16-Ton capacity) for bulk loads and 6-Wheeler Tippers for narrow residential streets.\n` +
          `• **Weighbridge Accuracy**: Every vehicle departs with a certified digital weighbridge ticket verified upon site arrival.\n\n` +
          `Our dispatch desk calls you within 15 minutes of placing an order to confirm route access and unloading time.`,
        suggestedActions: [
          { label: "Book Materials Now", url: "/checkout" },
          { label: "Call Dispatch (9505609865)", url: `tel:+91${BRAND_INFO.phone}` },
        ],
      });
    }

    // 2. CHECK IF USER IS ASKING ABOUT SAND VARIETIES OR DIFFERENCE
    if ((lower.includes("river sand") && (lower.includes("m sand") || lower.includes("m-sand"))) || lower.includes("difference") || lower.includes("compare")) {
      return NextResponse.json({
        reply: `🏗️ **Comparison: River Sand vs. VSI M-Sand**:\n\n` +
          `1. **Triple-Washed River Sand (Grade A)**:\n` +
          `   • Natural riverbed dredged sand, triple washed to ensure silt <2.5%.\n` +
          `   • **Rate**: ₹1,850 / Ton (or ₹28,500 for full 16-Ton Tipper Load).\n` +
          `   • **Best for**: Superior roof slab casting, smooth plastering, and RCC columns.\n\n` +
          `2. **Engineered VSI M-Sand (Concrete Sand)**:\n` +
          `   • Machine-crushed hard granite using Vertical Shaft Impactors (cubical grain, IS:383 Zone II compliant).\n` +
          `   • **Rate**: ₹1,100 / Ton.\n` +
          `   • **Best for**: High compressive structural concrete, beams, and cost-efficient construction.\n\n` +
          `3. **P-Sand (Plastering Sand)**:\n` +
          `   • Micro-fine double washed (0 - 2.36mm).\n` +
          `   • **Rate**: ₹1,350 / Ton for crack-free smooth wall finishes.\n\n` +
          `Which material would you like to order for your site?`,
        suggestedActions: [
          { label: "View Sand Catalogue", url: "/products?category=river-sand" },
          { label: "Inquire on WhatsApp", url: BRAND_INFO.whatsappUrl },
        ],
      });
    }

    // 3. CHECK IF USER IS ASKING FOR PRICES / RATES
    if (lower.includes("price") || lower.includes("rate") || lower.includes("cost") || lower.includes("how much") && !lower.includes("sqft")) {
      return NextResponse.json({
        reply: `💰 **Current Direct-from-Source Material Rates at Jayam Building Materials**:\n\n` +
          `• **River Sand (Grade A)**: ₹1,850 / Ton\n` +
          `• **Full 16-Ton Tipper River Sand**: ₹28,500 / Truck\n` +
          `• **VSI M-Sand (Concrete)**: ₹1,100 / Ton\n` +
          `• **P-Sand (Plastering)**: ₹1,350 / Ton\n` +
          `• **UltraTech Super Cement (53 Grade)**: ₹395 / 50kg Bag\n` +
          `• **Tata Tiscon 550D TMT Steel**: ₹68,500 / Ton\n` +
          `• **20mm Blue Metal Aggregates**: ₹780 / Ton\n` +
          `• **Wire-Cut Red Kiln Bricks**: ₹9.50 / Piece\n\n` +
          `*All weights are verified with printed digital weighbridge slips upon site unloading.*`,
        suggestedActions: [
          { label: "Open Order Cart", url: "/checkout" },
          { label: "Call Dispatch (9505609865)", url: `tel:+91${BRAND_INFO.phone}` },
        ],
      });
    }

    // 4. CHECK IF ASKING ABOUT TRACKING
    if (lower.includes("track") || lower.includes("status") || lower.includes("where is my order")) {
      return NextResponse.json({
        reply: `🚚 **Live Order Tracking**:\n\n` +
          `You can track your tipper dispatch anytime on our dedicated tracking portal:\n` +
          `1. Go to **Track Order** page.\n` +
          `2. Enter your booking mobile number and Order Reference ID (e.g. JBM-2026-XXXX).\n` +
          `3. View live tipper allocation and delivery progress.\n\n` +
          `You can also call our dispatch coordinator at **+91 ${BRAND_INFO.phone}** for live driver location.`,
        suggestedActions: [
          { label: "Go to Track Order Page", url: "/track-order" },
          { label: "Call Dispatch Desk", url: `tel:+91${BRAND_INFO.phone}` },
        ],
      });
    }

    // 5. PLASTERING CALCULATION
    if (lower.includes("plaster") && (lower.includes("calc") || lower.match(/\d+\s*(?:sqft|sq\s*ft)/i))) {
      let area = 800;
      const m = lower.match(/(\d+)\s*(?:sqft|sq\s*ft)/i);
      if (m) {
        area = parseInt(m[1]);
      }
      const calc = calculatePlasteringMaterials(area);
      return NextResponse.json({
        reply: `🧱 **Wall Plastering Material Estimation for ${calc.wallAreaSqFt} sq.ft Wall Surface (12mm Thickness / 1:4 Mortar Ratio)**:\n\n` +
          `• **Double-Washed P-Sand (Plastering)**: ~**${calc.sandTons} Tons** (~₹${Math.round(calc.sandTons * 1350).toLocaleString('en-IN')})\n` +
          `• **53 Grade Portland Cement**: ~**${calc.cementBags} Bags** (~₹${Math.round(calc.cementBags * 395).toLocaleString('en-IN')})\n\n` +
          `💰 **Estimated Plastering Materials Cost**: ~**₹${calc.estimatedCost.toLocaleString('en-IN')}**\n\n` +
          `Would you like to add these materials to your cart or order via WhatsApp?`,
        suggestedActions: [
          {
            label: "Add Plastering Materials to Cart",
            action: "add_plaster_to_cart",
            sandTons: calc.sandTons,
            cementBags: calc.cementBags,
          },
          {
            label: "Book via WhatsApp",
            url: `https://wa.me/91${BRAND_INFO.whatsappNumber}?text=Hello%20Jayam%20Materials,%20I%20need%20${calc.sandTons}%20tons%20P-Sand%20and%20${calc.cementBags}%20bags%20cement%20for%20${calc.wallAreaSqFt}%20sqft%20plastering.`,
          },
        ],
        calculation: {
          type: "plaster",
          ...calc,
        },
      });
    }

    // 6. SLAB RCC CONCRETE CALCULATION
    const slabMatch = lower.match(/(\d+)\s*(?:x|\*|by)\s*(\d+)/i) || lower.match(/(\d+)\s*(?:sqft|sq\s*ft|square\s*feet)/i);
    if (slabMatch || lower.includes("calculate") || lower.includes("how much sand") || lower.includes("how many bags") || lower.includes("slab") || lower.includes("roof")) {
      let length = 30;
      let width = 40;
      let thickness = 5;
      const sandType = lower.includes("m sand") || lower.includes("m-sand") ? "m-sand" : "river-sand";

      if (lower.match(/(\d+)\s*(?:x|\*|by)\s*(\d+)/i)) {
        const m = lower.match(/(\d+)\s*(?:x|\*|by)\s*(\d+)/i);
        if (m) {
          length = parseInt(m[1]);
          width = parseInt(m[2]);
        }
      } else if (lower.match(/(\d+)\s*(?:sqft|sq\s*ft)/i)) {
        const m = lower.match(/(\d+)\s*(?:sqft|sq\s*ft)/i);
        if (m) {
          const totalSqFt = parseInt(m[1]);
          length = Math.round(Math.sqrt(totalSqFt));
          width = Math.round(totalSqFt / length);
        }
      }

      const calc = calculateSlabMaterials(length, width, thickness, sandType);
      const sandLabel = sandType === "m-sand" ? "VSI Concrete M-Sand" : "Triple-Washed River Sand";

      return NextResponse.json({
        reply: `📐 **Construction Material Estimation for ${calc.slabAreaSqFt} sq.ft Slab (${length}' x ${width}', Thickness: ${thickness}" / M20 Grade)**:\n\n` +
          `• **${sandLabel}**: ~**${calc.sandTons} Tons** (~₹${calc.estimatedSandCost.toLocaleString('en-IN')})\n` +
          `• **Cement (Grade 53)**: ~**${calc.cementBags} Bags** (~₹${calc.estimatedCementCost.toLocaleString('en-IN')})\n` +
          `• **20mm Blue Metal Aggregates**: ~**${calc.aggregatesTons} Tons** (~₹${calc.estimatedAggregatesCost.toLocaleString('en-IN')})\n` +
          `• **Tipper Vehicles Required**: **${calc.tipperTrucksNeeded} Tipper Load(s)** (16-ton capacity)\n\n` +
          `💰 **Estimated Materials Subtotal**: ~**₹${calc.totalEstimatedCost.toLocaleString('en-IN')}**\n\n` +
          `*Note: Transport charges are confirmed by our dispatch desk based on site approach road.* Would you like us to schedule a tipper dispatch for this quantity?`,
        suggestedActions: [
          {
            label: "Add All Materials to Cart",
            action: "add_slab_to_cart",
            sandType,
            sandTons: calc.sandTons,
            cementBags: calc.cementBags,
            aggregatesTons: calc.aggregatesTons,
          },
          {
            label: "Book Tipper on WhatsApp",
            url: `https://wa.me/91${BRAND_INFO.whatsappNumber}?text=Hello%20Jayam%20Materials,%20I%20need%20${calc.sandTons}%20tons%20${sandLabel},%20${calc.cementBags}%20bags%20cement,%20and%20${calc.aggregatesTons}%20tons%20aggregates%20for%20a%20${calc.slabAreaSqFt}%20sqft%20slab.`,
          },
          { label: "Open Calculator Tool", action: "switch_to_calculator" },
        ],
        calculation: {
          type: "slab",
          ...calc,
        },
      });
    }

    // 6. DEFAULT INTELLIGENT HELPFUL RESPONSE
    return NextResponse.json({
      reply: `Hello! I am your **Jayam Building Materials AI Assistant**.\n\n` +
        `I can help you with:\n` +
        `• 📐 **Calculating Sand, Cement & Aggregates** for your slab, wall, or foundation.\n` +
        `• 💰 Checking current wholesale rates for River Sand, M-Sand, Cement, and Steel.\n` +
        `• 🚛 Estimating tipper lorry requirements (10-Wheeler vs. 6-Wheeler).\n` +
        `• 📦 Guiding you through 1-click booking without mandatory account logins.\n\n` +
        `How can I assist your construction project today?`,
      suggestedActions: [
        { label: "Calculate Slab Materials", action: "calc" },
        { label: "Check Sand Prices", action: "prices" },
        { label: "Speak to Dispatch Coordinator", url: `tel:+91${BRAND_INFO.phone}` },
      ],
    });
  } catch (error: any) {
    console.error("AI Assistant API error:", error);
    return NextResponse.json(
      { error: "AI Assistant is currently busy. Please reach us via WhatsApp or Phone at 9505609865." },
      { status: 500 }
    );
  }
}
