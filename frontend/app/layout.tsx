import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--ff-head",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--ff-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NextBuzz — Events That Move You",
  description:
    "Discover concerts, food festivals, workshops, comedy nights & more — book in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plusJakarta.variable}`}>
      <body className="relative z-[1]">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
