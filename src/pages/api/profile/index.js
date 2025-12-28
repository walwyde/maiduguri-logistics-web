

// pages/api/profile/index.js
import { auth } from "../../../auth";
import sql from "../utils/sql";

export default async function handler(req, res) {
  if (req.method === "GET") return getProfile(req, res);
  if (req.method === "PUT") return updateProfile(req, res);

  return res.status(405).json({ error: "Method Not Allowed" });
}

/* -------------------------------------------------------
   GET PROFILE
-------------------------------------------------------- */
async function getProfile(req, res) {
  try {
    const session = await auth(req);

    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = session.user.id;
    const userId = session.user.id;

    const rows = await sql.query`
      SELECT 
        u.id, u.name, u.email, u.image, u.role, u.phone, u.profile_image, 
        u.is_verified, u.created_at,
        r.vehicle_type, r.vehicle_model, r.vehicle_plate, r.license_number,
        r.years_experience, r.current_location_lat, r.current_location_lng,
        r.is_available, r.verification_status, r.rating, r.total_deliveries
      FROM auth_users u
      LEFT JOIN rider_profiles r ON u.id = r.user_id
      WHERE u.id = ${userId}
      LIMIT 1
    `;


    return res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error("GET /api/profile error", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/* -------------------------------------------------------
   UPDATE PROFILE (WITH FIXED TRANSACTION)
-------------------------------------------------------- */
async function updateProfile(req, res) {
  let session;
console.log("Update profile request body:", req.body);
  try {
    session = await auth(req);
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;
    const body = req.body;

    const {
      phone,
      role,
      profileImage,

      vehicleType,
      vehicleModel,
      vehiclePlate,
      licenseNumber,
      yearsExperience,

      currentLocationLat,
      currentLocationLng,
      isAvailable,
    } = body;

    if (!phone || !role) {
      return res.status(400).json({ error: "Phone and role are required" });
    }

    if (role === "rider") {
      if (!vehicleType || !yearsExperience || !vehiclePlate || !licenseNumber) {
        return res.status(400).json({
          error: "Vehicle type, experience, plate, and license number are required",
        });
      }

      if (currentLocationLat == null || currentLocationLng == null) {
        return res.status(400).json({
          error: "Rider current location is required",
        });
      }
    }

    /* -----------------------------------------
       BEGIN TRANSACTION
    ------------------------------------------ */
    await sql.query`START TRANSACTION`;

    // Update main user
    await sql.query`
      UPDATE auth_users
      SET 
        phone = ${phone},
        role = ${role},
        profile_image = ${profileImage || null},
        updated_at = NOW()
      WHERE id = ${userId}
    `;

    // Handle rider data
    if (role === "rider") {
      const exists = await sql.query`
        SELECT user_id FROM rider_profiles WHERE user_id = ${userId}
      `;

      if (exists.length > 0) {
        // Update
        await sql.query`
          UPDATE rider_profiles
          SET
            vehicle_type = ${vehicleType},
            vehicle_model = ${vehicleModel},
            vehicle_plate = ${vehiclePlate},
            license_number = ${licenseNumber},
            years_experience = ${yearsExperience || 0},
            current_location_lat = ${currentLocationLat},
            current_location_lng = ${currentLocationLng},
            is_available = ${isAvailable ? 1 : 0},
            updated_at = NOW()
          WHERE user_id = ${userId}
        `;
      } else {
        // Insert
        await sql.query`
          INSERT INTO rider_profiles (
            user_id, vehicle_type, vehicle_model, vehicle_plate,
            license_number, years_experience, current_location_lat,
            current_location_lng, is_available, verification_status,
            created_at, updated_at
          )
          VALUES (
            ${userId}, ${vehicleType}, ${vehicleModel}, ${vehiclePlate},
            ${licenseNumber}, ${yearsExperience || 0}, ${currentLocationLat},
            ${currentLocationLng}, ${isAvailable ? 1 : 0}, 'pending',
            NOW(), NOW()
          )
        `;
      }
    }

    /* -----------------------------------------
       COMMIT TRANSACTION
    ------------------------------------------ */
    await sql.query`COMMIT`;

    // Fetch updated profile
    const result = await sql.query`
      SELECT 
        u.id, u.name, u.email, u.image, u.role, u.phone, u.profile_image,
        u.is_verified, u.created_at,
        r.vehicle_type, r.vehicle_model, r.vehicle_plate, r.license_number,
        r.years_experience, r.current_location_lat, r.current_location_lng,
        r.is_available, r.verification_status, r.rating, r.total_deliveries
      FROM auth_users u
      LEFT JOIN rider_profiles r ON u.id = r.user_id
      WHERE u.id = ${userId}
      LIMIT 1
    `;

    console.log("Updated profile data:", result);

    return res.status(200).json({ user: result[0] });

  } catch (err) {
    console.error("PUT /api/profile error", err);

    // Rollback on any error
    try { await sql`ROLLBACK`; } catch {}

    // Handle MySQL unique errors
    if (err.code === "ER_DUP_ENTRY") {
      if (err.message.includes("vehicle_plate")) {
        return res.status(400).json({ error: "Vehicle plate already registered" });
      }
      if (err.message.includes("license_number")) {
        return res.status(400).json({ error: "License number already registered" });
      }
      if (err.message.includes("phone")) {
        return res.status(400).json({ error: "Phone number already registered" });
      }
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}
