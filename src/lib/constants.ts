// lib/constants.ts

import {
  LayoutDashboard,
  ChartNoAxesCombined,
  CalendarDays,
  Blocks,
  UsersRound,
} from "lucide-react";

export const MENU_ITEMS = [
  {
    icon: LayoutDashboard,
    label: "Ringkasan",
    href: "/",
  },
  {
    icon: ChartNoAxesCombined,
    label: "Keuangan",
    href: "/keuangan",
  },
  {
    icon: CalendarDays,
    label: "Kegiatan",
    href: "/kegiatan",
  },
  {
    icon: Blocks,
    label: "Inventaris",
    href: "/inventaris",
  },
  {
    icon: UsersRound,
    label: "Organisasi",
    href: "/organisasi",
  },
];
