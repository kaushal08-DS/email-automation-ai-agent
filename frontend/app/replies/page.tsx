"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { api } from "../../lib/api";

type EmailItem = {
  id: number;
  sender: string;
  subject: string;
  summary: string;
  suggested_reply: string | null;
  received_at?: string;
};

type EditState = {
  id: number;
  body: string;
};

export default function Replies() {
  const [items, setItems] = useState<EmailItem[]>([]);
  const [edit, setEdit] = useState<EditState | null>(null);

  const [loading, setLoading] = useState(true);

  const [shuffling, setShuffling] = useState(false);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [shuffleError, setShuffleError] = useState("");

  async function load() {
    try {
      setLoading(true);

      const data = await api(
        "/api/emails?category=reply"
      );

      setItems(data);
    } catch (error: any) {
      alert(
        error?.message ||
          "Unable to load replies."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function act(
    id: number,
    body: string
  ) {
    try {
      await api(
        `/api/emails/${id}/reply`,
        {
          method: "POST",
          body: JSON.stringify({
            body,
          }),
        }
      );

      setEdit(null);
      setShuffleCount(0);
      setShuffleError("");

      await load();

    } catch (error: any) {
      alert(
        error?.message ||
          "Unable to send reply."
      );
    }
  }

  async function handleIgnore(
    id: number
  ) {
    try {
      await api(
        `/api/emails/${id}/ignore`,
        {
          method: "POST",
        }
      );

      await load();

    } catch (error: any) {
      alert(
        error?.message ||
          "Unable to mark email as Do Not Reply."
      );
    }
  }

  async function handleShuffle() {
    if (!edit || shuffling) {
      return;
    }

    setShuffling(true);
    setShuffleError("");

    try {
      const response = await fetch(
        `/api/emails/${edit.id}/shuffle-reply`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_reply: edit.body,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to generate another reply."
        );
      }

      if (!data.reply) {
        throw new Error(
          "AI did not return a new reply."
        );
      }

      setEdit({
        ...edit,
        body: data.reply,
      });

      setShuffleCount(
        (count) => count + 1
      );

    } catch (error) {
      console.error(
        "SHUFFLE REPLY ERROR:",
        error
      );

      setShuffleError(
        error instanceof Error
          ? error.message
          : "Unable to generate another reply."
      );

    } finally {
      setShuffling(false);
    }
  }

  function openReply(
    id: number,
    suggestedReply: string | null
  ) {
    setShuffleCount(0);
    setShuffleError("");

    setEdit({
      id,
      body: suggestedReply || "",
    });
  }

  function closeEditor() {
    if (shuffling) {
      return;
    }

    setEdit(null);
    setShuffleCount(0);
    setShuffleError("");
  }

  return (
    <Layout>
      <div className="top">
        <div>
          <h1>Replies</h1>

          <p className="muted">
            Review every suggested reply before
            anything is sent.
          </p>
        </div>
      </div>

      <div className="stack">
        {loading ? (
          <div className="card">
            <p className="muted">
              Loading replies...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="card">
            <h3>No replies waiting</h3>

            <p className="muted">
              MailPilot AI hasn't found any emails
              requiring a reply.
            </p>
          </div>
        ) : (
          items.map((e) => (
            <div
              className="email"
              key={e.id}
            >
              <div className="muted">
                {e.sender}
              </div>

              <h3>
                {e.subject ||
                  "(No subject)"}
              </h3>

              <p>
                {e.summary ||
                  "No summary available."}
              </p>

              <div className="card">
                <b>
                  Suggested reply
                </b>

                <p
                  style={{
                    whiteSpace:
                      "pre-wrap",
                  }}
                >
                  {e.suggested_reply ||
                    "No suggested reply available."}
                </p>
              </div>

              <div
                className="row"
                style={{
                  marginTop: 12,
                }}
              >
                <button
                  className="btn primary"
                  onClick={() =>
                    openReply(
                      e.id,
                      e.suggested_reply
                    )
                  }
                >
                  Reply
                </button>

                <button
                  className="btn danger"
                  onClick={() =>
                    handleIgnore(e.id)
                  }
                >
                  Don’t Reply
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {edit && (
        <div
          className="layout-center"
          style={{
            position: "fixed",
            inset: 0,
            background: "#0007",
            zIndex: 100,
            padding: 20,
          }}
        >
          <div
            className="login"
            style={{
              textAlign: "left",
              width: "100%",
              maxWidth: 700,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2>
              Review before sending
            </h2>

            <p
              className="muted"
              style={{
                marginTop: 6,
                marginBottom: 14,
              }}
            >
              Edit the AI suggestion, shuffle it
              for another version, or send it
              through Gmail.
            </p>

            <textarea
              className="textarea"
              value={edit.body}
              onChange={(event) =>
                setEdit({
                  ...edit,
                  body: event.target.value,
                })
              }
              disabled={shuffling}
              placeholder="Write your reply..."
              style={{
                minHeight: 220,
                width: "100%",
                resize: "vertical",
              }}
            />

            {shuffleError && (
              <div
                style={{
                  marginTop: 12,
                  border:
                    "1px solid rgba(239,68,68,0.25)",
                  background:
                    "rgba(239,68,68,0.10)",
                  color: "#fca5a5",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontSize: 14,
                }}
              >
                {shuffleError}
              </div>
            )}

            <div
              className="row"
              style={{
                marginTop: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn secondary"
                onClick={closeEditor}
                disabled={shuffling}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn secondary"
                onClick={handleShuffle}
                disabled={shuffling}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    animation: shuffling
                      ? "mailpilot-spin 0.8s linear infinite"
                      : "none",
                  }}
                >
                  ↻
                </span>

                {shuffling
                  ? "Generating..."
                  : shuffleCount > 0
                    ? `Shuffle ${shuffleCount}`
                    : "Shuffle"}
              </button>

              <button
                className="btn primary"
                onClick={() =>
                  act(
                    edit.id,
                    edit.body
                  )
                }
                disabled={
                  shuffling ||
                  !edit.body.trim()
                }
              >
                Send email
              </button>
            </div>

            {shuffleCount > 0 && (
              <p
                className="muted"
                style={{
                  marginTop: 10,
                  fontSize: 13,
                }}
              >
                Generated{" "}
                {shuffleCount}{" "}
                alternative{" "}
                {shuffleCount === 1
                  ? "reply"
                  : "replies"}.
              </p>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes mailpilot-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Layout>
  );
}