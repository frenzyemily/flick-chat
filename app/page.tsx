export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#0f172a",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
        Flick Chat
      </h1>

      <p style={{ color: "#94a3b8", fontSize: "18px" }}>
        Connect. Chat. Share.
      </p>

      <button style={{
        marginTop: "25px",
        padding: "14px 30px",
        borderRadius: "10px",
        border: "none",
        background: "#6366f1",
        color: "white",
        fontSize: "16px",
        cursor: "pointer"
      }}>
        Get Started
      </button>
    </main>
  );
}
