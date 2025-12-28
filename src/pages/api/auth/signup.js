// pages/api/auth/signup.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookie from "cookie";
import sql from "../utils/sql"; // adjust path

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-prod";
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // ←←← THIS IS THE ONLY CHANGE NEEDED EVERYWHERE
    const existing = await (await sql`SELECT id FROM auth_users WHERE email = ${email}`)();
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await (await sql`
      INSERT INTO auth_users (email, password_hash, name, role, created_at)
      VALUES (${email}, ${password_hash}, ${name}, 'customer', NOW())
    `)();

    const insertedId = result.insertId;

    const users = await (await sql`
      SELECT id, email, name, role FROM auth_users WHERE id = ${insertedId} LIMIT 1
    `)();

    const user = users[0];
    if (!user) throw new Error("Failed to retrieve created user");

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_MAX_AGE }
    );

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: TOKEN_MAX_AGE,
        path: "/",
      })
    );

    return res.status(201).json({
  success: true,
  token,  // ⭐ RETURN IT
  user: {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  },
});
  } catch (error) {
    console.error("Sign up error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}