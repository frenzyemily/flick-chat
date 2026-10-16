import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b1020",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "76px",
          height: "76px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "24px",
          background: "#8b5cf6",
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        F
      </div>

      <h1
        style={{
          fontSize: "48px",
          margin: "0 0 12px",
          letterSpacing: "-2px",
        }}
      >
        Flick Chat
      </h1>

      <p
        style={{
          color: "#aab4cc",
          fontSize: "18px",
          maxWidth: "320px",
          lineHeight: 1.6,
        }}
      >
        Connect with friends, share moments, and keep every conversation alive.
      </p>

      <Link
        href="/auth"
        style={{
          marginTop: "28px",
          padding: "15px 40px",
          borderRadius: "12px",
          background: "#8b5cf6",
          color: "white",
          textDecoration: "none",
          fontSize: "16px",
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        Get Started →
      </Link>

      <p
        style={{
          marginTop: "40px",
          color: "#64748b",
          fontSize: "13px",
        }}
      >
        YOUR PEOPLE. YOUR MOMENTS. YOUR FLICK.
      </p>
    </main>
  );
}
