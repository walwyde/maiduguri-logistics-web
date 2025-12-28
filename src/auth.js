// src/auth.js — Token now stored in localStorage, not cookies
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

//------------------------------------------------------
// JWT Helpers
//------------------------------------------------------
function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || "customer",
    },
    JWT_SECRET,
    { expiresIn: TOKEN_MAX_AGE }
  );
}

//------------------------------------------------------
// AUTH — Works in API routes AND on client
//------------------------------------------------------

export async function auth(req = null) {
  let token = null;

  // -----------------------------
  // Extract token
  // -----------------------------
  if (req) {
    // API / server-side
    let header;
    try {
      header = typeof req.headers.get === "function"
        ? req.headers.get("authorization")
        : req.headers.authorization;
    } catch {
      header = undefined;
    }

    if (header?.startsWith("Bearer ")) {
      token = header.replace("Bearer ", "").trim();
    }
  } else if (typeof window !== "undefined") {
    // Client-side
    token = localStorage.getItem("auth-token");
  }

  if (!token) return null;

  // -----------------------------
  // Verify JWT
  // -----------------------------
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }

  // -----------------------------
  // Server-side: fetch user directly
  // -----------------------------
  if (req) {
    const sql = (await import("../src/pages/api/utils/sql")).default;

    // Prefer numeric id; fallback to email if id not present
    const userId = payload?.id ?? payload?.sub ?? null;
    const email = payload?.email ?? null;

    if (!userId && !email) return null;

    let rows = [];
    if (userId) {
      rows = await sql.query`
        SELECT id, email, name, role, phone
        FROM auth_users
        WHERE id = ${userId}
        LIMIT 1
      `;
    }

    if ((!rows || !rows.length) && email) {
      rows = await sql.query`
        SELECT id, email, name, role, phone
        FROM auth_users
        WHERE email = ${email}
        LIMIT 1
      `;
    }

    if (!rows?.length) return null;

    return { user: rows[0] };
  }

  // -----------------------------
  // Client-side: fetch via API
  // -----------------------------
  try {
    const res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { user: data.user };
  } catch {
    return null;
  }
}

