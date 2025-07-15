// lib/constants.ts

import {
  LayoutDashboard,
  ChartNoAxesCombined,
  CalendarDays,
  Blocks,
  UsersRound,
} from "lucide-react";

export const logoText = {
  line1: "PORTAL ONLINE MASJID",
  line2: "RAUDLATUSSHOLIHIN",
};

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
