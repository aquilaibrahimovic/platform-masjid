"use client";

import { ReactNode, useState, createContext, useContext } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "next-themes";

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
          <aside
            className={`
              fixed bottom-0 h-16 w-full
              sm:top-16 sm:left-0 sm:bottom-auto
              sm:h-[calc(100vh-64px)]
              ${isCompact ? "sm:w-22" : "sm:w-62"}
            `}
          >
            <Sidebar />
          </aside>

          {/* Page content */}
          <main
            className={`
              px-4 sm:px-0 sm:pr-4 pb-16
              ${isCompact ? "sm:ml-22" : "sm:ml-62"}
              sm:pb-0
            `}
          >
            {children}
          </main>
        </div>
      </SidebarContext.Provider>
    </ThemeProvider>
  );
}
