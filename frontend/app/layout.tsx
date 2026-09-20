import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Email Automation AI",
  description:
    "AI-powered email automation and Gmail productivity platform.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}