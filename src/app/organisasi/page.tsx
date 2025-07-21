"use client";

import { MENU_ITEMS } from "@/lib/constants";

export default function OrganisasiPage() {
  const organisasiItem = MENU_ITEMS.find((item) => item.label === "Organisasi");
  const OrganisasiIcon = organisasiItem?.icon;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-background1 rounded-bl-2xl sticky top-16 z-30">
        <div className="flex flex-1 bg-background2 rounded-2xl h-14 justify-between items-center shadow-lg pr-4">
          <div className="flex gap-2 items-center">
            <div className="h-14 w-14 bg-accent2b bg-linear-to-t from-accent1a to-accent2a rounded-2xl flex items-center justify-center">
              {OrganisasiIcon && (
                <OrganisasiIcon className="w-8 h-8 text-alwaysWhite" />
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-accent2b">
              Organisasi
            </h1>
          </div>
        </div>
      </div>

      {/* Empty body — to be filled later */}
      <div className="p-4 text-text2 text-sm">
        Konten organisasi akan ditambahkan di sini.
      </div>
    </div>
  );
}
