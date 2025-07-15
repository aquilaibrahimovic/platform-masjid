"use client";

import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "@/lib/constants";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between h-full bg-background1 px-4 pb-4 gap-4">
      {/* Part 1: Logo */}
      <div className="relative w-full h-14 sm:flex hidden">
        <div className="w-14 h-14 bg-accent1a" />
        <div className="absolute left-14 top-0 w-40 h-14 bg-accent2a" />
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
      <div className="relative w-full sm:flex hidden items-center">
        <div className="w-6 h-6 bg-text2" />
        <div className="absolute left-8 w-46 text-xs text-text3">
          © 2025 Robith Enha
        </div>
      </div>
    </div>
  );
}
