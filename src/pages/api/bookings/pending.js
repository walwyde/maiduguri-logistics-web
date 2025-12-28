// pages/api/bookings/pending.js
import sql, { join } from "../utils/sql";
import { auth } from "../../../auth";

export default async function handler(req, res) {
  try {
    const session = await auth(req);
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;

    // Get the role of the logged-in user
    const [userRow] = await sql.query`
      SELECT role FROM auth_users WHERE id = ${userId} LIMIT 1
    `;
    if (!userRow) return res.status(404).json({ error: "User not found" });
    const role = userRow.role;

    if (role !== "rider" && role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Check if bookings table has rider_id
    const hasRiderRes = await sql.query`
      SELECT COUNT(*) AS cnt 
      FROM information_schema.columns
      WHERE table_schema = DATABASE() 
        AND table_name = 'bookings' 
        AND column_name = 'rider_id'
    `;
    const hasRider = Boolean(hasRiderRes?.[0]?.cnt);

    // Base query for all pending bookings
    let query = hasRider
      ? sql`
        SELECT 
          b.*,
          c.name AS customer_name,
          c.phone AS customer_phone,
          r.name AS rider_name,
          r.phone AS rider_phone,
          rp.rating AS rider_rating
        FROM bookings b
        LEFT JOIN auth_users c ON b.customer_id = c.id
        LEFT JOIN auth_users r ON b.rider_id = r.id
        LEFT JOIN rider_profiles rp ON r.id = rp.user_id
        WHERE b.status = 'pending'
        ORDER BY b.created_at DESC
      `
      : sql`
        SELECT 
          b.*,
          c.name AS customer_name,
          c.phone AS customer_phone
        FROM bookings b
        LEFT JOIN auth_users c ON b.customer_id = c.id
        WHERE b.status = 'pending'
        ORDER BY b.created_at DESC
      `;

    const bookings = await query();
    return res.status(200).json(bookings);

  } catch (err) {
    console.error("/api/bookings/pending error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
