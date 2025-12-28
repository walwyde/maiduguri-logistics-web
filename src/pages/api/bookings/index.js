// pages/api/bookings/index.js
import sql, { join } from "../utils/sql";
import { auth } from "../../../auth";

export default async function handler(req, res) {
  try {
    const session = await auth(req);
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = session.user.id;

    // ====================== GET: List bookings ======================
    if (req.method === "GET") {
      const limit = parseInt(req.query.limit, 10) || 10;
      const offset = parseInt(req.query.offset, 10) || 0;
      const statusFilter = req.query.status;

      // Get user role — works with old sql`...` style
      const userRows = await sql.query`
        SELECT role FROM auth_users WHERE id = ${userId} LIMIT 1
      `;
      if (!userRows.length) return res.status(404).json({ error: "User not found" });
      const role = userRows[0].role;

      const whereFragments = [];
      if (role === "customer") whereFragments.push(sql`b.customer_id = ${userId}`);
      if (statusFilter) whereFragments.push(sql`b.status = ${statusFilter}`);

      // Some DBs (older schema) may not include a 'rider_id' column on bookings.
      // Check for presence and only include rider joins when available.
      const hasRiderRes = await sql.query`
        SELECT COUNT(*) AS cnt FROM information_schema.columns
        WHERE table_schema = DATABASE() AND table_name = 'bookings' AND column_name = 'rider_id'
      `;
      const hasRider = Boolean(hasRiderRes?.[0]?.cnt);

      // Build a SQL fragment (executable) using the tag helper
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
          `
        : sql`
            SELECT 
              b.*,
              c.name AS customer_name,
              c.phone AS customer_phone
            FROM bookings b
            LEFT JOIN auth_users c ON b.customer_id = c.id
          `;

      // Only push rider_id condition when the column exists
      if (role === "rider" && hasRider) whereFragments.push(sql`b.rider_id = ${userId}`);

      if (whereFragments.length > 0) {
        query = sql`${query} WHERE ${join(whereFragments, " AND ")}`;
      }

      const finalQuery = sql`${query} ORDER BY b.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

      // Execute the SQL fragment and return rows
      const bookings = await finalQuery();
      return res.status(200).json(bookings);
    }

    // ====================== POST: Create booking ======================
    if (req.method === "POST") {
      const {
        pickupAddress,
        pickupLat,
        pickupLng,
        pickupContactName,
        pickupContactPhone,
        deliveryAddress,
        deliveryLat,
        deliveryLng,
        deliveryContactName,
        deliveryContactPhone,
        packageDescription,
        packageWeight,
        packageDimensions,
        specialInstructions,
        distanceKm,
        totalPriceNaira,
        paymentMethod = "cash",
      } = req.body;

      if (
        !pickupAddress || !pickupLat || !pickupLng ||
        !deliveryAddress || !deliveryLat || !deliveryLng ||
        !packageDescription || !distanceKm || !totalPriceNaira
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const bookingNumber = `BK-${Date.now().toString().slice(-8)}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

      // Execute INSERT — returns result with insertId
      let insertResult;
      try {
        insertResult = await sql.query`
        INSERT INTO bookings (
          booking_number, customer_id,
          pickup_address, pickup_lat, pickup_lng,
          pickup_contact_name, pickup_contact_phone,
          delivery_address, delivery_lat, delivery_lng,
          delivery_contact_name, delivery_contact_phone,
          package_description, package_weight, package_dimensions,
          special_instructions, distance_km, total_price_naira,
          payment_method, status, created_at, updated_at
        ) VALUES (
          ${bookingNumber}, ${userId},
          ${pickupAddress}, ${pickupLat}, ${pickupLng},
          ${pickupContactName || ""}, ${pickupContactPhone || ""},
          ${deliveryAddress}, ${deliveryLat}, ${deliveryLng},
          ${deliveryContactName || ""}, ${deliveryContactPhone || ""},
          ${packageDescription}, ${packageWeight ?? null}, ${packageDimensions || ""},
          ${specialInstructions || ""}, ${distanceKm}, ${totalPriceNaira},
          ${paymentMethod}, 'pending', NOW(), NOW()
        )
      `;
      } catch (err) {
        // Catch FK / schema errors and give better feedback
        console.error("Booking insert error:", err);
        if (err && err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({ error: "Customer id not present in referenced table - check your DB schema or ensure a customer record exists for the user." });
        }

        throw err;
      }

      const insertId = insertResult.insertId;

      // Fetch full booking with joined data
      const bookingRows = await sql.query`
        SELECT 
          b.*,
          c.name AS customer_name,
          c.phone AS customer_phone
        FROM bookings b
        LEFT JOIN auth_users c ON b.customer_id = c.id
        WHERE b.booking_id = ${insertId}
      `;
      
      // sql.query returns rows directly
      // bookingRows is already the array of rows

      const newBooking = bookingRows[0];

      return res.status(201).json({
        success: true,
        booking: newBooking,
        id: newBooking.booking_id,
        booking_number: newBooking.booking_number
      });
    }

    // Method Not Allowed
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (err) {
    console.error("/api/bookings error:", err);
    return res.status(500).json({ 
      error: "Internal Server Error", 
      details: err.message 
    });
  }
}