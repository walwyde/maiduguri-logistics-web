// pages/api/auth/me.js
import jwt from "jsonwebtoken";
import cookie from "cookie";
import sql from "../../utils/sql";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Extract token from cookie
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const token = cookies["auth-token"];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify JWT
    const payload = jwt.verify(token, JWT_SECRET);

    // Fetch fresh user data using the clean sql.query helper
    const rows = await sql.query`
      SELECT id, email, name, role, phone, created_at 
      FROM auth_users 
      WHERE id = ${payload.id}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = rows[0];


    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone || null,
      },
    });
  } catch (error) {
    console.error("Auth /me error:", error.message);

    // Invalid or expired token
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    return res.status(401).json({ error: "Unauthorized" });
  }
}