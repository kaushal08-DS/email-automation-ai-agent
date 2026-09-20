import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Email Automation AI",
  description:
    "AI-powered email automation and Gmail productivity platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="9Iuc9tDfkXbqFzu8ZDCIw7rf38-gGQUN95OHM6gJeAY"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}