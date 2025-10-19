import "@/styles/globals.css";
import { Metadata } from "next";
import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";

import NavBar from "@/components/NavBar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  fallback: ["monospace"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "MAHE DUBAI DEMO",
    template: `%s - MAHE DUBAI DEMO`,
  },
  icons: {
    icon: "/mahe_logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} font-sans`}
      lang="en"
    >
      <head />
      <body className="min-h-screen bg-black text-white">
        <main className="relative flex flex-col gap-6 h-screen w-screen">
          {/* <NavBar /> */}
          {children}
        </main>
      </body>
    </html>
  );
}
