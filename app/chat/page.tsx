"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type Conversation = {
  conversation_id: string;
  title: string | null;
  is_group: boolean;
};

export default function ChatPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadConversations() {
      const supabase = createClient();

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        router.replace("/auth");
        return;
      }

      const { data, error: queryError } = await supabase
        .from("conversation_members")
        .select(`
          conversation_id,
          conversations (
            title,
            is_group
          )
        `)
        .eq("user_id", authData.user.id);

      if (queryError) {
        setError(queryError.message);
        setLoading(false);
        return;
      }

      const result = (data ?? []).map((item: any) => ({
        conversation_id: item.conversation_id,
        title: item.conversations?.title ?? "Conversation",
        is_group: item.conversations?.is_group ?? false,
      }));

      setConversations(result);
      setLoading(false);
    }

    loadConversations();
  }, [router]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <header style={{ marginBottom: "30px" }}>
        <h1 style={{ color: "#a78bfa" }}>Flick Chat 💬</h1>
        <p style={{ color: "#aab4cc" }}>
          Your conversations, all in one place.
        </p>
      </header>

      <section
        style={{
          maxWidth: "650px",
          margin: "0 auto",
        }}
      >
        <h2>Your Conversations</h2>

        {loading && <p>Loading your conversations...</p>}

        {error && (
          <p style={{ color: "#fca5a5", overflowWrap: "anywhere" }}>
            Could not load conversations: {error}
          </p>
        )}

        {!loading && !error && conversations.length === 0 && (
          <p style={{ color: "#aab4cc" }}>
            You don't have any conversations yet.
          </p>
        )}

        <div style={{ display: "grid", gap: "12px" }}>
          {conversations.map((conversation) => (
            <button
              key={conversation.conversation_id}
              onClick={() =>
                router.push(
                  `/chat/${conversation.conversation_id}`
                )
              }
              style={{
                padding: "18px",
                background: "#151d32",
                color: "white",
                border: "1px solid #293550",
                borderRadius: "14px",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              <strong>
                {conversation.is_group ? "👥 " : "💬 "}
                {conversation.title}
              </strong>
              <p
                style={{
                  marginBottom: 0,
                  color: "#aab4cc",
                  fontSize: "13px",
                }}
              >
                Open conversation →
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={async () => {
            await createClient().auth.signOut();
            router.replace("/auth");
          }}
          style={{
            marginTop: "28px",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "1px solid #475569",
            background: "transparent",
            color: "white",
            cursor: "pointer",
          }}
        >
          Log Out
        </button>
      </section>
    </main>
  );
}
