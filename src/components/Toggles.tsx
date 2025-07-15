"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import clsx from "clsx";
import { ChevronRight, SunMedium } from "lucide-react";

export function SidebarToggleButton() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <button
      onClick={() => setIsOpen((prev) => !prev)}
      className={clsx(
        "relative w-8 h-8 rounded-lg cursor-pointer border-2 overflow-hidden bg-background3 shadow-sm",
        isOpen ? "border-yes" : "border-no"
      )}
      aria-label="Toggle Sidebar"
    >
      {/* Animated Rectangle (background strip on left) */}
      <motion.div
        animate={{
          width: isOpen ? "12px" : "24px",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 18,
        }}
        style={{
          backgroundColor: isOpen ? "var(--Yes)" : "var(--No)",
        }}
        className="absolute top-0 left-0 h-8"
      ></motion.div>

      {/* Animated Chevron */}
      <motion.div
        className="absolute"
        animate={{
          x: isOpen ? -5 : 1,
          y: -10,
          rotate: isOpen ? 0 : 180,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 18,
        }}
      >
        <ChevronRight size={20} strokeWidth={2} className="text-background1" />
      </motion.div>
    </button>
  );
}

export function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const [sunMode, setSunMode] = useState(false);

  // Sync local UI animation state with resolved theme
  useEffect(() => {
    if (resolvedTheme === "light") {
      setSunMode(true);
    } else if (resolvedTheme === "dark") {
      setSunMode(false);
    }
  }, [resolvedTheme]);

  const toggleTheme = () => {
    const next = sunMode ? "dark" : "light";
    setTheme(next);
    setSunMode(!sunMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-8 h-8 rounded-full overflow-hidden bg-accent2a cursor-pointer shadow-sm"
      aria-label="Toggle Theme"
    >
      {/* White Circle */}
      <motion.div
        className="absolute rounded-full bg-alwaysWhite"
        animate={{
          x: sunMode ? 8 : 0,
          y: sunMode ? -8 : -16,
          width: sunMode ? 16 : 32,
          height: sunMode ? 16 : 32,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 18,
        }}
      />

      {/* Overlay Accent Circle */}
      <motion.div
        className="absolute rounded-full bg-accent2a"
        animate={{
          x: -8,
          y: sunMode ? -16 : -24,
          width: sunMode ? 16 : 32,
          height: sunMode ? 16 : 32,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 18,
        }}
      />

      {/* Sun Icon */}
      <motion.div
        className="absolute top-1 left-1 text-[var(--color-alwaysWhite)]"
        animate={{
          opacity: sunMode ? 1 : 0,
          width: sunMode ? 32 : 4,
          height: sunMode ? 32 : 4,
          x: sunMode ? -4 : 8,
          y: sunMode ? -4 : 8,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 18,
        }}
      >
        <SunMedium className="w-full h-full" />
      </motion.div>
    </button>
  );
}
