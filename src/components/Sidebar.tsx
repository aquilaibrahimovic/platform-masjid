"use client";

import { usePathname } from "next/navigation";
import { MENU_ITEMS, logoText } from "@/lib/constants";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import Link from "next/link";
import { useSidebar } from "@/components/LayoutWrapper";

export default function Sidebar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const { isCompact } = useSidebar();

  return (
    <div className="flex sm:flex-col items-stretch justify-between sm:justify-start h-full sm:gap-4 gap-0 px-0.5 py-0.5 sm:px-4 sm:pb-4">
      {/* Part 1: Logo */}
      <div className="relative w-full h-14 sm:flex hidden select-none short:hidden">
        <div className="w-14 h-14">
          <motion.svg
            key={resolvedTheme}
            width="56"
            height="56"
            viewBox="0 0 56 56"
            animate={{
              fill: [
                "var(--color-accent1a)",
                "var(--color-accent2b)",
                "var(--color-text1)",
                "var(--color-accent1b)",
                "var(--color-accent2a)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <use href="/images/sprites.svg#logo-masjid" />
          </motion.svg>
        </div>
        <motion.div
          className="absolute top-[6px] w-39 h-14 flex flex-col justify-center"
          style={{ lineHeight: 1 }}
          animate={{
            opacity: isCompact ? 0 : 1,
            left: isCompact ? 44 : 60, // 60 = original left-15 (15 * 4px), 44 = 60 - 16
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div className="font-special text-md font-bold text-text3">
            {logoText.line1}
          </div>
          <div className="font-special text-2xl font-medium text-accent1b">
            {logoText.line2}
          </div>
        </motion.div>
      </div>

      {/* Part 2: Menu */}
      <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-start sm:gap-1 flex-1">
        {MENU_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={label}
              href={href}
              className={`
    relative w-14 sm:w-full h-full sm:h-min px-2 sm:px-4 py-2 cursor-pointer rounded-full sm:rounded-lg
    flex items-center justify-center sm:justify-start
    ${
      isActive
        ? "bg-accent1b shadow-sm"
        : "hover:bg-background2 hover:shadow-sm"
    }
    sm:flex-row sm:justify-start sm:gap-0
    flex-col items-center justify-center gap-1
  `}
            >
              {/* Icon */}
              <Icon
                className={`w-6 h-6 ${
                  isActive ? "text-background1" : "text-accent1b"
                }`}
              />

              {/* Label (desktop only) */}
              <motion.div
                className={`sm:absolute sm:top-1/2 sm:-translate-y-1/2 sm:ml-0
    text-sm font-semibold hidden sm:block ${
      isActive ? "text-background1" : "text-text1"
    }`}
                animate={{
                  opacity: isCompact ? 0 : 1,
                  left: isCompact ? 32 : 48, // 48 = original left-12 (12 * 4), 32 = 48 - 16
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {label}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Part 3: Copyright */}
      <div className="relative w-full sm:flex hidden items-center h-6 px-4">
        <div className="w-6 h-6">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="text-text2 fill-current"
            aria-hidden="true"
          >
            <use href="/images/sprites.svg#logo-robith" />
          </svg>
        </div>
        <motion.div
          className="absolute text-xs text-text3 w-28"
          animate={{
            opacity: isCompact ? 0 : 1,
            left: isCompact ? 26 : 42, // 32 = original left-8 (8 * 4), 16 = 32 - 16
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          © 2025 Robith Enha
        </motion.div>
      </div>
    </div>
  );
}
