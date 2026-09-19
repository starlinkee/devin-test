import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hello",
  description: "A tiny app living on the web.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
