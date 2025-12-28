import sql from "../../../utils/sql";
import { auth } from "../../../../../auth";

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await auth(req);
    if (!session || !session.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;
    
    // Get booking ID from query params
    const { id: bookingId } = req.query;

    if (!bookingId) {
      return res.status(400).json({ error: "Booking ID is required" });
    }

    // Get user role
    const userRows = await sql.query`
      SELECT role FROM auth_users WHERE id = ${userId} LIMIT 1
    `;

    if (!userRows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const userRole = userRows[0].role;

    // Only riders can confirm payment
    if (userRole !== "rider") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Get booking - using booking_id column
    const bookingRows = await sql.query`
      SELECT * FROM bookings 
      WHERE booking_id = ${bookingId} AND rider_id = ${userId}
      LIMIT 1
    `;

    if (!bookingRows.length) {
      return res.status(404).json({ error: "Booking not found or not assigned to you" });
    }

    const booking = bookingRows[0];

    // Check if booking is delivered
    if (booking.status !== "delivered") {
      return res.status(400).json({
        error: "Booking must be delivered before confirming payment"
      });
    }

    // Check if payment method is cash
    if (booking.payment_method !== "cash") {
      return res.status(400).json({
        error: "Only cash payments need confirmation"
      });
    }

    // Check if already confirmed
    if (booking.payment_confirmed) {
      return res.status(400).json({
        error: "Payment already confirmed"
      });
    }

    // Update or create payment record
    const paymentRows = await sql.query`
      SELECT * FROM payments WHERE booking_id = ${bookingId} LIMIT 1
    `;

    if (paymentRows.length > 0) {
      // Update existing payment
      await sql.query`
        UPDATE payments 
        SET rider_confirmed = true, 
            rider_confirmed_at = NOW(),
            payment_status = 'completed',
            updated_at = NOW()
        WHERE booking_id = ${bookingId}
      `;
    } else {
      // Create new payment record
      await sql.query`
        INSERT INTO payments (
          booking_id, amount_naira, payment_method, payment_status,
          rider_confirmed, rider_confirmed_at
        ) VALUES (
          ${bookingId}, ${booking.total_price_naira}, ${booking.payment_method},
          'completed', true, NOW()
        )
      `;
    }

    // Update booking payment status and confirmation
    await sql.query`
      UPDATE bookings 
      SET payment_status = 'paid', 
          payment_confirmed = true,
          updated_at = NOW()
      WHERE booking_id = ${bookingId}
    `;

    return res.status(200).json({ 
      success: true, 
      message: "Payment confirmed successfully" 
    });
  } catch (err) {
    console.error("POST /api/bookings/[id]/payment error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
}