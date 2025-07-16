"use client";

import { ReactNode, useState, createContext, useContext } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "next-themes";
import { motion } from "motion/react";

// Provide this context to children
const SidebarContext = createContext<{
  isCompact: boolean;
  toggleCompact: () => void;
}>({
  isCompact: true,
  toggleCompact: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const [isCompact, setIsCompact] = useState(true);

  const toggleCompact = () => setIsCompact((prev) => !prev);

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system">
      <SidebarContext.Provider value={{ isCompact, toggleCompact }}>
        {/* Header */}
        <header className="h-16 w-full sticky top-0 z-50">
          <Header />
        </header>

        {/* Main layout container */}
        <div className="min-h-[calc(100vh-64px)]">
          {/* Sidebar */}
          <motion.aside
            animate={{
              width: isCompact ? 88 : 248, // in pixels
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 18,
            }}
            className={`
          fixed bottom-0 h-16 w-full
          sm:top-16 sm:left-0 sm:bottom-auto
          sm:h-[calc(100vh-64px)]
          hidden sm:block
        `}
            style={{
              width: isCompact ? 88 : 248, // fallback for SSR
            }}
          >
            <Sidebar />
          </motion.aside>

          {/* Page content */}
          <motion.main
            animate={{
              marginLeft: isCompact ? 88 : 248, // sync with sidebar
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 18,
            }}
            className={`
          px-4 sm:px-0 sm:pr-4 pb-16 sm:pb-0
        `}
            style={{
              marginLeft: isCompact ? 88 : 248,
            }}
          >
            {children}
          </motion.main>
        </div>
      </SidebarContext.Provider>
    </ThemeProvider>
  );
}
