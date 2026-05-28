import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";
import CompareBar from "@/components/compare/CompareBar";

export const metadata: Metadata = {
  title: "CollégeIQ — Find Your Perfect College",
  description: "Discover, compare, and shortlist the best colleges in India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <CompareBar />
        </Providers>
      </body>
    </html>
  );
}
