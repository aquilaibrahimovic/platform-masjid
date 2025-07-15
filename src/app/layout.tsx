import type { Metadata } from "next";
import {
  Ubuntu_Sans,
  Ubuntu_Sans_Mono,
  Yanone_Kaffeesatz,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "next-themes";

// Fonts
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ubuntuSans.variable} ${ubuntuMono.variable} ${yanone.variable} antialiased font-sans`}
      >
        <ThemeProvider attribute="data-theme" defaultTheme="system">
          {/* Header */}
          <header className="h-16 w-full sticky top-0 z-50">
            <Header />
          </header>

          {/* Main layout container */}
          <div className="min-h-[calc(100vh-64px)]">
            {/* Sidebar */}
            <aside
              className="
      fixed
      bottom-0
      h-16
      w-full

      sm:top-16
      sm:left-0
      sm:h-[calc(100vh-64px)]
      sm:w-62
      sm:bottom-auto
    "
            >
              <Sidebar />
            </aside>

            {/* Page content */}
            <main
              className="
              px-4 sm:px-0 sm:pr-4
      pb-16
      sm:ml-62
      sm:pb-0
    "
            >
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
