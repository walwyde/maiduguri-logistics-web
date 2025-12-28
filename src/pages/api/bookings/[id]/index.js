// pages/api/bookings/[id].js
import sql from "../../utils/sql";
import { auth } from "../../../../auth";

const q = (strings, ...values) => sql.query(strings, ...values);

export default async function handler(req, res) {
  const { id: bookingId } = req.query;

  try {
    const session = await auth(req);
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;

    // ============================
    //           GET
    // ============================
    if (req.method === "GET") {

      const [userRow] = await q`
        SELECT role FROM auth_users WHERE id = ${userId} LIMIT 1
      `;

      if (!userRow) {
        return res.status(404).json({ error: "User not found" });
      }

      const role = userRow.role;

      let where = sql`WHERE b.booking_id = ${bookingId}`;

      if (role === "customer") {
        where = sql`WHERE b.booking_id = ${bookingId} AND b.customer_id = ${userId}`;
      } else if (role === "rider") {
        where = sql`WHERE b.booking_id = ${bookingId} AND b.rider_id = ${userId}`;
      } else if (role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
      }

      const bookingRows = await q`
        SELECT 
          b.*,
          c.name AS customer_name,
          c.phone AS customer_phone,
          r.name AS rider_name,
          r.phone AS rider_phone,
          rp.rating AS rider_rating,
          COALESCE(p.rider_confirmed, false) AS payment_confirmed
        FROM bookings b
        LEFT JOIN auth_users c ON b.customer_id = c.id
        LEFT JOIN auth_users r ON b.rider_id = r.id
        LEFT JOIN rider_profiles rp ON r.id = rp.user_id
        LEFT JOIN payments p ON b.booking_id = p.booking_id
        ${where}
        LIMIT 1
      `;

      if (!bookingRows.length) {
        return res.status(404).json({ error: "Booking not found" });
      }

      return res.status(200).json(bookingRows[0]);
    }

    // ============================
    //           PATCH
    // ============================
    if (req.method === "PATCH") {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const validStatuses = [
        "accepted",
        "in_transit",
        "delivered",
        "rejected",
        "cancelled",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const [userRow] = await q`
        SELECT role FROM auth_users WHERE id = ${userId} LIMIT 1
      `;

      if (!userRow || !["rider", "admin"].includes(userRow.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const [booking] = await q`
        SELECT * FROM bookings WHERE booking_id = ${bookingId} LIMIT 1
      `;

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      if (!booking.rider_id && status !== "accepted") {
        return res.status(400).json({
          error: "Cannot update status: no rider assigned",
        });
      }

      // =======================
      //     STATUS HANDLING
      // =======================

      if (status === "accepted" && !booking.rider_id) {
        await q`
          UPDATE bookings 
          SET status = ${status}, rider_id = ${userId}, updated_at = NOW()
          WHERE booking_id = ${bookingId}
        `;
      } else if (status === "in_transit") {
        await q`
          UPDATE bookings 
          SET status = ${status}, picked_up_at = NOW(), updated_at = NOW()
          WHERE booking_id = ${bookingId}
        `;
      } else if (status === "delivered") {
        await q`
          UPDATE bookings 
          SET status = ${status}, delivered_at = NOW(), updated_at = NOW()
          WHERE booking_id = ${bookingId}
        `;

        const [existingPayment] = await q`
          SELECT 1 FROM payments WHERE booking_id = ${bookingId} LIMIT 1
        `;

        if (!existingPayment) {
          await q`
            INSERT INTO payments (
              booking_id, amount_naira, payment_method, payment_status
            ) VALUES (
              ${bookingId},
              ${booking.total_price_naira},
              ${booking.payment_method},
              ${booking.payment_method === "bank_transfer" 
                ? "completed" 
                : "pending"}
            )
          `;
        }

        if (booking.rider_id) {
          await q`
            INSERT INTO rider_profiles (user_id, total_deliveries)
            VALUES (${booking.rider_id}, 1)
            ON DUPLICATE KEY UPDATE total_deliveries = total_deliveries + 1
          `;
        }
      } else {
        await q`
          UPDATE bookings 
          SET status = ${status}, updated_at = NOW()
          WHERE booking_id = ${bookingId}
        `;
      }

      const [updated] = await q`
        SELECT * FROM bookings WHERE booking_id = ${bookingId}
      `;

      return res.status(200).json(updated);
    }

    // Unsupported method
    return res.status(405).json({ error: "Method not allowed" });

  } catch (err) {
    console.error("API /api/bookings/[id] error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
