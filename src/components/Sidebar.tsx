"use client";

import { usePathname } from "next/navigation";
import { MENU_ITEMS, logoText } from "@/lib/constants";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex flex-col justify-between h-full bg-background1 px-4 pb-4 gap-4">
      {/* Part 1: Logo */}
      <div className="relative w-full h-14 sm:flex hidden select-none">
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
        <div
          className="absolute left-15 top-[6px] w-39 h-14 flex flex-col justify-center"
          style={{ lineHeight: 1 }}
        >
          <div className="font-special text-md font-bold text-text3">
            {logoText.line1}
          </div>
          <div className="font-special text-2xl font-medium text-accent1b">
            {logoText.line2}
          </div>
        </div>
      </div>

      {/* Part 2: Menu */}
      <div className="flex sm:flex-col justify-start items-start gap-1 flex-1">
        {MENU_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={label}
              href={href}
              className={`
    relative w-full px-4 py-2 cursor-pointer rounded-lg
    flex items-center justify-start
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
              <div
                className={`sm:absolute sm:left-12 sm:top-1/2 sm:-translate-y-1/2 sm:ml-0 sm:opacity-100
               text-sm font-semibold hidden sm:block ${
                 isActive ? "text-background1" : "text-text1"
               }`}
              >
                {label}
              </div>
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
        <div className="absolute left-8 text-xs text-text3 w-46">
          © 2025 Robith Enha
        </div>
      </div>
    </div>
  );
}
