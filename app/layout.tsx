import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GATE Master Tracker",
  description: "Complete GATE CSE preparation and progress tracking platform",
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