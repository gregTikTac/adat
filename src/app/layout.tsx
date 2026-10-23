import type { Metadata, Viewport } from "next";
import { Tenor_Sans, Ysabeau } from "next/font/google";
import { brand } from "@/config/brand";
import "./globals.css";

/** Brand book: Ysabeau for text, Tenor Sans for the wordmark. */
const body = Ysabeau({
  variable: "--brand-font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const wordmark = Tenor_Sans({
  variable: "--brand-font-wordmark",
  subsets: ["latin", "cyrillic"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brand.name}: ${brand.descriptor}`,
  description: brand.hero.lead,
};

export const viewport: Viewport = {
  themeColor: "#315059",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${body.variable} ${wordmark.variable} dark h-full antialiased`}>
      <body className="min-h-full bg-[#315059] font-sans text-white">{children}</body>
    </html>
  );
}
