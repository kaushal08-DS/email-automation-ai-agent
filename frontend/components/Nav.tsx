"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  Inbox,
  Mail,
  MessageSquare,
  Settings,
  Sparkles,
  Tags,
} from "lucide-react";

const items = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    href: "/replies",
    label: "Replies",
    icon: MessageSquare,
  },
  {
    href: "/promotional",
    label: "Promotional",
    icon: Tags,
  },
  {
    href: "/insights",
    label: "Insights & Analysis",
    icon: Sparkles,
  },
  {
    href: "/alerts",
    label: "Alerts & Deadlines",
    icon: AlertTriangle,
  },
  {
    href: "/writing-style",
    label: "Writing Style",
    icon: FileText,
  },
  {
    href: "/gmail-connection",
    label: "Gmail Connection",
    icon: Inbox,
  },
  {
    href: "/subscription",
    label: "Subscription",
    icon: CreditCard,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <aside className="side">
      <div className="brand">
        <span>MailPilot AI</span>
      </div>

      <nav className="nav" aria-label="MailPilot navigation">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "active" : ""}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}