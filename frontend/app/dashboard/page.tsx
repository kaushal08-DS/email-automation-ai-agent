"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Mail,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Tag,
} from "lucide-react";

import Layout from "../../components/Layout";
import { api } from "../../lib/api";

type DashboardData = {
  received?: number;
  replies?: number;
  promotional?: number;
  pending_actions?: number;
  alerts?: Array<{
    id: number | string;
    title: string;
    description: string;
    priority?: string;
  }>;
};

type UserData = {
  name?: string;
  email?: string;
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>();
  const [user, setUser] = useState<UserData>();
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const [userData, dashboardData] = await Promise.all([
          api("/api/me"),
          api("/api/dashboard"),
        ]);

        setUser(userData);
        setData(dashboardData);
      } catch (error: any) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function syncGmail() {
    try {
      setBusy(true);

      await api("/api/gmail/sync", {
        method: "POST",
      });

      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setBusy(false);
    }
  }

  const firstName = user?.name
    ? user.name.split(" ")[0]
    : "";

  const stats = [
    {
      label: "Emails received",
      value: data?.received ?? 0,
      icon: Mail,
    },
    {
      label: "Needs reply",
      value: data?.replies ?? 0,
      icon: MessageSquare,
    },
    {
      label: "Promotional",
      value: data?.promotional ?? 0,
      icon: Tag,
    },
    {
      label: "Pending actions",
      value: data?.pending_actions ?? 0,
      icon: Clock3,
    },
  ];

  return (
    <Layout>
      {/* =====================================================
          HEADER
          ===================================================== */}

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
            MAILPILOT WORKSPACE
          </p>

          <h1 style={{ marginTop: 7 }}>
            Good to see you
            {firstName ? `, ${firstName}` : ""}.
          </h1>

          <p
            className="muted"
            style={{
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            Here’s what needs your attention today.
          </p>
        </div>

        <button
          className="btn primary"
          onClick={syncGmail}
          disabled={busy}
        >
          <RefreshCw
            size={16}
            className={busy ? "animate-spin" : ""}
          />

          {busy ? "Syncing…" : "Sync Gmail"}
        </button>
      </div>

      {/* =====================================================
          LOADING
          ===================================================== */}

      {loading && (
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <RefreshCw
              size={18}
              className="animate-spin"
            />

            <span className="muted">
              Loading your MailPilot workspace…
            </span>
          </div>
        </div>
      )}

      {/* =====================================================
          DASHBOARD
          ===================================================== */}

      {!loading && data && (
        <>
          {/* KPI CARDS */}

          <div className="grid">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  className="card"
                  key={stat.label}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <span className="muted">
                      {stat.label}
                    </span>

                    <Icon
                      size={17}
                      strokeWidth={1.7}
                      color="#888"
                    />
                  </div>

                  <div className="kpi">
                    {stat.value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* =================================================
              AI ACTIONS
              ================================================= */}

          <div
            className="card"
            style={{
              marginTop: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <Sparkles
                    size={18}
                    color="#fff"
                  />

                  <h2>AI actions</h2>
                </div>

                <p
                  className="muted"
                  style={{
                    marginTop: 8,
                    marginBottom: 0,
                  }}
                >
                  {data.replies
                    ? `You have ${data.replies} email${
                        data.replies > 1 ? "s" : ""
                      } waiting for a reply.`
                    : "No reply is waiting right now."}
                </p>
              </div>

              {data.replies ? (
                <a
                  href="/replies"
                  className="btn secondary"
                >
                  Review replies
                  <ArrowUpRight size={15} />
                </a>
              ) : (
                <span className="pill">
                  <CheckCircle2
                    size={13}
                    style={{
                      marginRight: 5,
                    }}
                  />
                  Inbox clear
                </span>
              )}
            </div>

            {/* ALERTS */}

            {data.alerts && data.alerts.length > 0 ? (
              <div className="stack">
                {data.alerts
                  .slice(0, 5)
                  .map((alert) => (
                    <div
                      className="email"
                      key={alert.id}
                    >
                      <div
                        className="row"
                        style={{
                          marginBottom: 8,
                        }}
                      >
                        <AlertCircle size={16} />

                        <b>
                          {alert.title}
                        </b>

                        {alert.priority && (
                          <span className="pill">
                            {alert.priority}
                          </span>
                        )}
                      </div>

                      <p>
                        {alert.description}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <div
                className="email"
                style={{
                  marginTop: 18,
                  textAlign: "center",
                }}
              >
                <CheckCircle2
                  size={25}
                  style={{
                    display: "block",
                    margin: "0 auto 10px",
                  }}
                />

                <h3>
                  No urgent actions
                </h3>

                <p>
                  Your current inbox has no
                  detected urgent items.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* =====================================================
          EMPTY / ERROR-SAFE STATE
          ===================================================== */}

      {!loading && !data && (
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <AlertCircle size={18} />

            <div>
              <h3>
                Dashboard data unavailable
              </h3>

              <p
                className="muted"
                style={{
                  marginTop: 6,
                  marginBottom: 0,
                }}
              >
                Please refresh the page or sync Gmail
                again.
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}