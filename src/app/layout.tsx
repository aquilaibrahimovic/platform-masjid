import type { Metadata } from "next";
import {
  Ubuntu_Sans,
  Ubuntu_Sans_Mono,
  Yanone_Kaffeesatz,
} from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const yanone = Yanone_Kaffeesatz({
  subsets: ["latin"],
  variable: "--font-yanone",
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

const ubuntuSans = Ubuntu_Sans({
  variable: "--font-ubuntu-sans",
  subsets: ["latin"],
});

const ubuntuMono = Ubuntu_Sans_Mono({
  variable: "--font-ubuntu-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Masjid Management",
  description: "Dashboard for Mosque Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ubuntuSans.variable} ${ubuntuMono.variable} ${yanone.variable} antialiased font-sans`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
