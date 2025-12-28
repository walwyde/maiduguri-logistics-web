import sql from "../../utils/sql";
import { auth } from "../../../../auth";

export default async function handler(req, res) {
  try {
    const session = await auth(req);

    if (!session || !session.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;
    const range = req.query.range || "week";

    // Get user role
    const userRows = await sql.query`
      SELECT role FROM auth_users WHERE id = ${userId} LIMIT 1
    `;

    if (!userRows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const userRole = userRows[0].role;

    let stats = {};

    if (userRole === "customer") {
      const [totalBookings, completedBookings, activeBookings, totalSpent] =
        await Promise.all([
          sql`SELECT COUNT(*) AS count FROM bookings WHERE customer_id = ${userId}`,
          sql`SELECT COUNT(*) AS count FROM bookings WHERE customer_id = ${userId} AND status = 'delivered'`,
          sql`SELECT COUNT(*) AS count FROM bookings WHERE customer_id = ${userId} AND status IN ('pending', 'accepted', 'in_transit')`,
          sql`SELECT SUM(total_price_naira) AS total FROM bookings WHERE customer_id = ${userId} AND status = 'delivered'`,
        ]);

      stats = {
        totalBookings: Number(totalBookings[0]?.count ?? 0),
        completedBookings: Number(completedBookings[0]?.count ?? 0),
        activeBookings: Number(activeBookings[0]?.count ?? 0),
        totalSpent: Number(totalSpent[0]?.total ?? 0),
      };
    }

    if (userRole === "rider") {
      const [
        totalDeliveries,
        totalEarnings,
        currentMonthEarnings,
      ] = await Promise.all([
        sql`SELECT COUNT(*) AS count FROM bookings WHERE rider_id = ${userId} AND status = 'delivered'`,
        sql`SELECT SUM(total_price_naira) AS total FROM bookings WHERE rider_id = ${userId} AND status = 'delivered'`,
        sql`
          SELECT SUM(total_price_naira) AS total 
          FROM bookings 
          WHERE rider_id = ${userId} 
            AND status = 'delivered'
            AND YEAR(delivered_at) = YEAR(CURDATE())
            AND MONTH(delivered_at) = MONTH(CURDATE())
        `,
      ]);

      stats = {
        totalDeliveries: Number(totalDeliveries[0]?.count ?? 0),
        totalEarnings: Number(totalEarnings[0]?.total ?? 0),
        currentMonthEarnings: Number(currentMonthEarnings[0]?.total ?? 0),
      };
    }
    return res.status(200).json(stats);
  } catch (err) {
    console.error("GET /api/dashboard/stats error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
