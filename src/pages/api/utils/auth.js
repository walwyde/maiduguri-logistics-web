// utils/auth.js
import jwt from "jsonwebtoken";
import cookie from "cookie";
import sql from "./sql";

const JWT_SECRET = process.env.JWT_SECRET;

export async function auth(req) {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies["auth-token"];

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET);

    const userRows = await sql`
      SELECT id, email, name, role 
      FROM auth_users 
      WHERE id = ${decoded.id}
      LIMIT 1
    `;

    if (!userRows.length) return null;

    return { user: userRows[0] };

  } catch (err) {
    console.error("Auth error:", err);
    return null;
  }
}
