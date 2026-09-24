"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Mail,
  RefreshCw,
  ShoppingBag,
  Trash2,
  XCircle,
} from "lucide-react";

import Layout from "../../components/Layout";
import { api } from "../../lib/api";

type PurchaseEmail = {
  id: number;
  sender?: string;
  subject?: string;
  body_text?: string;
  snippet?: string;
  summary?: string;
  received_at?: string;
  purchase_decision?: string;
  purchase_reason?: string;
};

function formatDate(date?: string) {
  if (!date) return "";

  try {
    return new Date(date).toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  } catch {
    return "";
  }
}

function decisionLabel(
  decision?: string
) {
  switch (decision) {
    case "likely_purchase":
      return "Likely Purchase";

    case "likely_not_purchase":
      return "Likely Not Needed";

    case "review":
      return "Review";

    default:
      return "Review";
  }
}

export default function PurchasesPage() {
  const [emails, setEmails] = useState<
    PurchaseEmail[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<number | null>(
    null
  );

  async function loadPurchases() {
    try {
      setLoading(true);

      const data = await api(
        "/api/emails?category=purchase"
      );

      setEmails(data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPurchases();
  }, []);

  async function deletePurchase(id: number) {
    const confirmed = window.confirm(
      "Remove this purchase email from MailPilot?"
    );

    if (!confirmed) return;

    try {
      setBusy(true);

      await api(`/api/emails/${id}/purchase`, {
        method: "DELETE",
      });

      setEmails((current) =>
        current.filter(
          (email) => email.id !== id
        )
      );

      if (openId === id) {
        setOpenId(null);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteAllPurchases() {
    if (emails.length === 0) return;

    const confirmed = window.confirm(
      `Remove all ${emails.length} purchase emails from MailPilot?`
    );

    if (!confirmed) return;

    try {
      setBusy(true);

      await api("/api/emails/purchases", {
        method: "DELETE",
      });

      setEmails([]);
      setOpenId(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout>
      {/* HEADER */}
      <div className="top">
        <div>
          <p
            className="muted"
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
            }}
          >
            AI PURCHASE INTELLIGENCE
          </p>

          <h1 style={{ marginTop: 7 }}>
            Purchases
          </h1>

          <p
            className="muted"
            style={{
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            Review purchase emails and understand
            what needs your attention.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn secondary"
            onClick={loadPurchases}
            disabled={loading || busy}
          >
            <RefreshCw
              size={15}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          {emails.length > 0 && (
            <button
              className="btn secondary"
              onClick={deleteAllPurchases}
              disabled={busy}
            >
              <Trash2 size={15} />
              Delete all
            </button>
          )}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid">
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <span className="muted">
              Purchase emails
            </span>

            <ShoppingBag
              size={18}
            />
          </div>

          <div className="kpi">
            {emails.length}
          </div>
        </div>

        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <span className="muted">
              Need review
            </span>

            <AlertCircle
              size={18}
            />
          </div>

          <div className="kpi">
            {
              emails.filter(
                (email) =>
                  email.purchase_decision ===
                  "review"
              ).length
            }
          </div>
        </div>

        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <span className="muted">
              Likely purchases
            </span>

            <CheckCircle2
              size={18}
            />
          </div>

          <div className="kpi">
            {
              emails.filter(
                (email) =>
                  email.purchase_decision ===
                  "likely_purchase"
              ).length
            }
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div
        className="card"
        style={{
          marginTop: 18,
        }}
      >
        {loading ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
            }}
          >
            <RefreshCw
              size={22}
              className="animate-spin"
              style={{
                margin: "0 auto 12px",
              }}
            />

            <p className="muted">
              Analyzing purchase emails…
            </p>
          </div>
        ) : emails.length === 0 ? (
          <div
            style={{
              padding: 45,
              textAlign: "center",
            }}
          >
            <ShoppingBag
              size={30}
              style={{
                margin: "0 auto 12px",
              }}
            />

            <h3>
              No purchase emails
            </h3>

            <p
              className="muted"
              style={{
                marginTop: 7,
              }}
            >
              MailPilot hasn't detected any
              purchase-related emails yet.
            </p>
          </div>
        ) : (
          <div className="stack">
            {emails.map((email) => {
              const open =
                openId === email.id;

              return (
                <div
                  className="email"
                  key={email.id}
                >
                  {/* EMAIL HEADER */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-start",
                      gap: 15,
                    }}
                  >
                    <div
                      style={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <div
                        className="row"
                        style={{
                          marginBottom: 7,
                        }}
                      >
                        <ShoppingBag
                          size={16}
                        />

                        <b>
                          {email.subject ||
                            "Purchase email"}
                        </b>
                      </div>

                      <p
                        className="muted"
                        style={{
                          margin: 0,
                          fontSize: 13,
                        }}
                      >
                        {email.sender ||
                          "Unknown sender"}
                      </p>

                      {email.received_at && (
                        <p
                          className="muted"
                          style={{
                            marginTop: 5,
                            marginBottom: 0,
                            fontSize: 12,
                          }}
                        >
                          {formatDate(
                            email.received_at
                          )}
                        </p>
                      )}
                    </div>

                    <span className="pill">
                      {decisionLabel(
                        email.purchase_decision
                      )}
                    </span>
                  </div>

                  {/* SUMMARY */}
                  {email.summary && (
                    <p
                      style={{
                        marginTop: 14,
                        marginBottom: 0,
                      }}
                    >
                      {email.summary}
                    </p>
                  )}

                  {/* AI REASON */}
                  <div
                    style={{
                      marginTop: 15,
                      padding: 14,
                      borderRadius: 12,
                      border:
                        "1px solid rgba(255,255,255,.08)",
                      background:
                        "rgba(255,255,255,.025)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems:
                          "center",
                      }}
                    >
                      <CheckCircle2
                        size={15}
                      />

                      <strong>
                        AI assessment
                      </strong>
                    </div>

                    <p
                      className="muted"
                      style={{
                        marginTop: 8,
                        marginBottom: 0,
                      }}
                    >
                      {email.purchase_reason ||
                        "Review the purchase details before taking action."}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 15,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      className="btn secondary"
                      onClick={() =>
                        setOpenId(
                          open
                            ? null
                            : email.id
                        )
                      }
                    >
                      <Mail size={15} />

                      {open
                        ? "Hide email"
                        : "Read email"}

                      {open ? (
                        <ChevronUp
                          size={15}
                        />
                      ) : (
                        <ChevronDown
                          size={15}
                        />
                      )}
                    </button>

                    <button
                      className="btn secondary"
                      onClick={() =>
                        deletePurchase(
                          email.id
                        )
                      }
                      disabled={busy}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>

                  {/* FULL EMAIL */}
                  {open && (
                    <div
                      style={{
                        marginTop: 15,
                        paddingTop: 15,
                        borderTop:
                          "1px solid rgba(255,255,255,.08)",
                      }}
                    >
                      <p
                        className="muted"
                        style={{
                          fontSize: 12,
                          marginBottom: 8,
                        }}
                      >
                        Email content
                      </p>

                      <div
                        style={{
                          whiteSpace:
                            "pre-wrap",
                          lineHeight: 1.7,
                          fontSize: 14,
                        }}
                      >
                        {email.body_text ||
                          email.snippet ||
                          "No email body available."}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}