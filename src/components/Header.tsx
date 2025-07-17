import { SidebarToggleButton, ThemeToggleButton } from "./Toggles";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { logoText } from "@/lib/constants";

export default function Header() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="flex h-16 justify-between items-center px-4 gap-2 bg-background1">
      <SidebarToggleButton />
      <div className="relative h-14 flex-1 sm:hidden short:flex select-none">
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
          className="absolute top-[6px] w-39 h-14 left-15 hidden sm:hidden short:flex flex-col justify-center"
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
      <ThemeToggleButton />
    </div>
  );
}
