// utils/useAuth.js
import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();

  //------------------------------------------------------
  // Load user on first mount using JWT from localStorage
  //------------------------------------------------------
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const user = data.user
          setUser(prev => ({ ...prev, ...user }));
          setToken(token);
        } else {
          setUser(null);
          localStorage.removeItem("auth-token");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
        localStorage.removeItem("auth-token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  //------------------------------------------------------
  // Sign in
  //------------------------------------------------------
  const signInWithCredentials = async ({ email, password, callbackUrl = "/" }) => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    
    if (!res.ok) throw new Error(data.error || "Sign in failed");

    // Save JWT in localStorage
    localStorage.setItem("auth-token", data.token);
    setUser(data.user);
    router.push(callbackUrl);

    return data;
  };

  //------------------------------------------------------
  // Sign up
  //------------------------------------------------------
  const signUpWithCredentials = async ({ name, email, password, callbackUrl = "/" }) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Sign up failed");

    // Save JWT
    localStorage.setItem("auth-token", data.token);

    setUser(data.user);
    router.push(callbackUrl);

    return data;
  };

  //------------------------------------------------------
  // Sign out
  //------------------------------------------------------
  const signOut = async () => {
    localStorage.removeItem("auth-token");
    setUser(null);
    router.push("/account/signin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        signInWithCredentials,
        signUpWithCredentials,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
