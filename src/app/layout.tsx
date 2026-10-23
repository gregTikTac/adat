import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { brand } from "@/config/brand";
import "./globals.css";

/** Swap these two for the brand-book fonts. */
const body = Manrope({
  variable: "--brand-font-body",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const display = Cormorant_Garamond({
  variable: "--brand-font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brand.name}: ${brand.descriptor}`,
  description: brand.hero.lead,
};

export const viewport: Viewport = {
  themeColor: "#0a0d16",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${body.variable} ${display.variable} dark h-full antialiased`}>
      <body className="min-h-full bg-brand-ink font-sans text-white">{children}</body>
    </html>
  );
}
