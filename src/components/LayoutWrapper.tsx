"use client";

import { ReactNode, useState, createContext, useContext } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import { usePathname } from "next/navigation";

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
  const hasMounted = useHasMounted();
  const toggleCompact = () => setIsCompact((prev) => !prev);
  const pathname = usePathname(); // ← will be used as a unique key

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
          {hasMounted && (
            <>
              {/* ✅ Animated Sidebar for sm+ */}
              <motion.aside
                animate={{
                  width: isCompact ? 88 : 248,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 18,
                }}
                className={`
        hidden sm:block
        fixed bottom-0 h-16 w-full
        sm:top-16 sm:left-0 sm:bottom-auto
        sm:h-[calc(100vh-64px)]
        bg-background1
      `}
                style={{
                  width: isCompact ? 88 : 248,
                }}
              >
                <Sidebar />
              </motion.aside>

              {/* ✅ Static Dock Sidebar for mobile (<sm) */}
              <aside
                className={`
        sm:hidden
        fixed bottom-0 left-0 right-0 m-4 shadow-sm rounded-full 
        h-16 bg-background3/50 backdrop-blur border-2 border-background3 z-40
      `}
              >
                <Sidebar />
              </aside>
            </>
          )}

          {/* Page content */}
          <motion.main
            animate={
              hasMounted
                ? {
                    marginLeft: isCompact ? 88 : 248,
                  }
                : {}
            }
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 18,
            }}
            className="px-4 sm:px-0 sm:pr-4 pb-16 sm:pb-0"
            style={{
              marginLeft: hasMounted && isCompact ? 88 : 248,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </motion.main>
        </div>
      </SidebarContext.Provider>
    </ThemeProvider>
  );
}
