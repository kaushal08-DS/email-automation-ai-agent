"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { api } from "../../lib/api";

export default function Promotional() {
  const [x, setX] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  async function loadPromotions() {
    try {
      setLoading(true);

      const data = await api(
        "/api/emails?category=promotional"
      );

      setX(data);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPromotions();
  }, []);

  async function deletePromotion(id: number) {
    const confirmed = window.confirm(
      "Delete this promotional email from your Promotional section?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await api(`/api/emails/${id}/promotion`, {
        method: "DELETE",
      });

      // Remove immediately from the screen.
      setX((current) =>
        current.filter((email) => email.id !== id)
      );
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function deleteAllPromotions() {
    if (x.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Delete all ${x.length} promotional emails from your Promotional section?`
    );

    if (!confirmed) return;

    try {
      setDeletingAll(true);

      await api("/api/emails/promotions", {
        method: "DELETE",
      });

      // Clear the page immediately.
      setX([]);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeletingAll(false);
    }
  }

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1>Promotional</h1>

          <p className="muted">
            Simple explanations of marketing and advertising emails.
          </p>
        </div>

        <button
          onClick={deleteAllPromotions}
          disabled={deletingAll || x.length === 0}
          style={{
            border: "1px solid #dc2626",
            background: x.length === 0 ? "#f3f4f6" : "#fff",
            color: x.length === 0 ? "#9ca3af" : "#dc2626",
            padding: "10px 16px",
            borderRadius: "10px",
            cursor:
              deletingAll || x.length === 0
                ? "not-allowed"
                : "pointer",
            fontWeight: 600,
          }}
        >
          {deletingAll
            ? "Deleting..."
            : `Delete All${x.length ? ` (${x.length})` : ""}`}
        </button>
      </div>

      {loading ? (
        <div className="muted">
          Loading promotional emails...
        </div>
      ) : x.length === 0 ? (
        <div className="email">
          <h3>No promotional emails</h3>

          <p className="muted">
            Your promotional section is clear.
          </p>
        </div>
      ) : (
        <div className="stack">
          {x.map((e) => (
            <div className="email" key={e.id}>
              <div className="muted">
                {e.sender}
              </div>

              <h3>{e.subject}</h3>

              <p>
                <b>What it is:</b>{" "}
                {e.promo_explanation}
              </p>

              <p>
                <b>AI suggestion:</b>{" "}
                {e.promo_suggestion}
              </p>

              <p>
                <b>Why:</b>{" "}
                {e.promo_reason}
              </p>

              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() =>
                    deletePromotion(e.id)
                  }
                  disabled={deletingId === e.id}
                  style={{
                    border: "1px solid #dc2626",
                    background: "#fff",
                    color: "#dc2626",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor:
                      deletingId === e.id
                        ? "not-allowed"
                        : "pointer",
                    fontWeight: 600,
                  }}
                >
                  {deletingId === e.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}