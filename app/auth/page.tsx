"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        window.location.href = "/chat";
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
          },
        });

        if (error) throw error;

        if (data.session) {
          window.location.href = "/chat";
        } else {
          setMessage(
            "Account created! Check your email to confirm your account."
          );
        }
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b1020",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#151d32",
          padding: "28px",
          borderRadius: "20px",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ color: "#a78bfa", fontSize: "32px" }}>
          Flick Chat
        </h1>

        <h2>{isLogin ? "Welcome back!" : "Create your account"}</h2>

        <p style={{ color: "#aab4cc" }}>
          {isLogin
            ? "Log in to continue your conversations."
            : "Join Flick Chat and connect with people."}
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "16px" }}
        >
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={30}
              style={inputStyle}
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password (at least 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#8b5cf6",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Log In"
                : "Create Account"}
          </button>
        </form>

        {message && (
          <p
            role="status"
            style={{ color: "#c4b5fd", overflowWrap: "anywhere" }}
          >
            {message}
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: "24px" }}>
          {isLogin ? "New to Flick Chat?" : "Already have an account?"}
          {" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#c4b5fd",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #35415d",
  background: "#0b1020",
  color: "white",
  fontSize: "16px",
};
