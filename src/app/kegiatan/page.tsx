// kegiatan/page.tsx
"use client";

import { ReactNode } from "react";
import { ActivityIcon } from "lucide-react"; // Replace with your actual icon import if different

export default function KegiatanPage(): ReactNode {
  return (
    <div className="min-h-screen w-full bg-background1">
      <div className="bg-background1 rounded-bl-2xl sticky top-16 z-30">
        <div className="flex flex-1 bg-background2 rounded-2xl h-14 justify-between items-center shadow-lg pr-4">
          <div className="flex gap-2 items-center">
            <div className="h-14 w-14 bg-accent2b bg-linear-to-t from-accent1a to-accent2a rounded-2xl flex items-center justify-center">
              <ActivityIcon className="w-8 h-8 text-alwaysWhite" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-accent2b">
              Kegiatan
            </h1>
          </div>
        </div>
      </div>

      {/* Empty Page Body */}
      <div className="p-4">{/* Content goes here */}</div>
    </div>
  );
}
