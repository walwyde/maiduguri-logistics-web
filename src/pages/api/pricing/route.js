import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    // Get current pricing configuration
    const pricingRows = await sql`
      SELECT * FROM pricing_config 
      WHERE is_active = true 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    const pricing = pricingRows[0] || {
      base_price_per_km: 50.0,
      minimum_fare: 300.0,
      city: "Maiduguri",
    };

    return Response.json(pricing);
  } catch (err) {
    console.error("GET /api/pricing error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userRows = await sql`
      SELECT role FROM auth_users WHERE id = ${session.user.id} LIMIT 1
    `;

    if (!userRows.length || userRows[0].role !== "admin") {
      return Response.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { base_price_per_km, minimum_fare, city } = body;

    if (!base_price_per_km || !minimum_fare) {
      return Response.json(
        { error: "Missing required pricing fields" },
        { status: 400 },
      );
    }

    // Deactivate old pricing
    await sql`
      UPDATE pricing_config SET is_active = false WHERE is_active = true
    `;

    // Create new pricing configuration
    const insertResult = await sql`
      INSERT INTO pricing_config (base_price_per_km, minimum_fare, city, is_active)
      VALUES (${base_price_per_km}, ${minimum_fare}, ${city || "Maiduguri"}, true)
    `;

    const insertedId = insertResult.insertId;
    const newPricingRows = await sql`SELECT * FROM pricing_config WHERE id = ${insertedId} LIMIT 1`;

    return Response.json(newPricingRows?.[0]);
  } catch (err) {
    console.error("PUT /api/pricing error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
