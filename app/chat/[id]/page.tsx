"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const loadMessages = useCallback(async () => {
    const supabase = createClient();

    const { data, error: queryError } = await supabase
      .from("messages")
      .select("id, sender_id, content, created_at")
      .eq("conversation_id", id)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (queryError) {
      setError(queryError.message);
      return;
    }

    setMessages((data ?? []) as Message[]);
    setError("");
  }, [id]);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function initialize() {
      const { data, error: authError } = await supabase.auth.getUser();

      if (authError || !data.user) {
        router.replace("/auth");
        return;
      }

      if (!active) return;
      setUserId(data.user.id);

      const { data: membership, error: membershipError } = await supabase
        .from("conversation_members")
        .select("conversation_id")
        .eq("conversation_id", id)
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (membershipError || !membership) {
        if (active) {
          setError("You don't have access to this conversation.");
          setLoading(false);
        }
        return;
      }

      if (active) {
        await loadMessages();
        setLoading(false);
      }
    }

    initialize();

    const channel = supabase
      .channel(`messages-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${id}`,
        },
        () => {
          if (active) loadMessages();
        }
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [id, router, loadMessages]);

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const content = text.trim();
    if (!content || sending || !userId) return;

    setSending(true);
    setError("");

    const supabase = createClient();

    const { error: sendError } = await supabase.from("messages").insert({
      conversation_id: id,
      sender_id: userId,
      content,
    });

    if (sendError) {
      setError(sendError.message);
    } else {
      setText("");
      await loadMessages();
    }

    setSending(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0b1020",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          padding: "18px",
          background: "#151d32",
          borderBottom: "1px solid #293550",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <button
          onClick={() => router.push("/chat")}
          style={smallButtonStyle}
        >
          ← Back
        </button>
        <h2 style={{ color: "#c4b5fd", margin: 0 }}>Flick Chat</h2>
      </header>

      <section
        aria-live="polite"
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "760px",
          boxSizing: "border-box",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        {loading && <p>Loading messages...</p>}

        {!loading && messages.length === 0 && !error && (
          <p style={{ color: "#aab4cc", textAlign: "center" }}>
            No messages yet. Start the conversation!
          </p>
        )}

        {messages.map((message) => {
          const own = message.sender_id === userId;

          return (
            <div
              key={message.id}
              style={{
                display: "flex",
                justifyContent: own ? "flex-end" : "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "12px 15px",
                  borderRadius: "16px",
                  background: own ? "#7c3aed" : "#202b43",
                  overflowWrap: "anywhere",
                }}
              >
                <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {message.content}
                </p>
                <small style={{ opacity: 0.7 }}>
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
            </div>
          );
        })}

        {error && (
          <p style={{ color: "#fca5a5", overflowWrap: "anywhere" }}>
            {error}
          </p>
        )}
      </section>

      <form
        onSubmit={sendMessage}
        style={{
          display: "flex",
          gap: "10px",
          padding: "14px",
          background: "#151d32",
          borderTop: "1px solid #293550",
          position: "sticky",
          bottom: 0,
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          maxLength={2000}
          aria-label="Message"
          style={{
            flex: 1,
            minWidth: 0,
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #35415d",
            background: "#0b1020",
            color: "white",
            fontSize: "16px",
          }}
        />

        <button
          type="submit"
          disabled={sending || !text.trim()}
          style={{
            ...smallButtonStyle,
            background: "#8b5cf6",
            border: "none",
            opacity: sending || !text.trim() ? 0.6 : 1,
          }}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}

const smallButtonStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #475569",
  background: "#202b43",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};
