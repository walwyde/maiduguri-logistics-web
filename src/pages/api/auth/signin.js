// pages/api/auth/signin.js – CLEAN VERSION
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookie from "cookie";
import sql from "../utils/sql";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  try {
    const rows = await sql.query`SELECT * FROM auth_users WHERE email = ${email}`;
    
    if (!rows.length) return res.status(401).json({ error: "CredentialsSignin" });
  console.log("Sign in attempt for email:", rows);

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "CredentialsSignin" });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_MAX_AGE }
    );

    res.setHeader("Set-Cookie", cookie.serialize("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: TOKEN_MAX_AGE,
      path: "/",
    }));

    return res.status(200).json({
  success: true,
  token,  
  user: { 
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role 
  }
});
  } catch (error) {
    console.error("Sign in error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}