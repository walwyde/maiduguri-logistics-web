// pages/api/auth/signout.js
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Clear the auth cookie
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })
  );

  return res.status(200).json({ success: true });
}