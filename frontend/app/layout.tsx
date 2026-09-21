import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MailPilot AI",
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
          content="pZDZ4sgrY5-ekI1GZ1hOGKk6d23rLGIVu7kRInvtS50"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}