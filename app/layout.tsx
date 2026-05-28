import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harsh Kumar — Full Stack & AI Engineer",
  description: "Portfolio of Harsh Kumar. Builder of Monexi.in. Full Stack Developer & AI Engineer.",
  keywords: ["Harsh Kumar", "Full Stack Developer", "AI Engineer", "Monexi", "Next.js"],
  authors: [{ name: "Harsh Kumar" }],
  openGraph: {
    title: "Harsh Kumar — Full Stack & AI Engineer",
    description: "Builder of Monexi.in. Full Stack & AI Engineer.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}