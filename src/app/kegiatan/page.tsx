import { MENU_ITEMS } from "@/lib/constants";

export default function KegiatanPage() {
  const kegiatanItem = MENU_ITEMS.find((item) => item.label === "Kegiatan");
  const KegiatanIcon = kegiatanItem?.icon;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-background1 rounded-bl-2xl sticky top-16">
        <div className="flex flex-1 bg-background2 rounded-2xl h-14 justify-between items-center shadow-md pr-1">
          <div className="flex gap-2 items-center">
            <div className="h-14 w-14 bg-accent2b rounded-2xl flex items-center justify-center">
              {KegiatanIcon && <KegiatanIcon className="w-6 h-6 text-white" />}
            </div>
            <h1 className="text-2xl font-semibold text-accent1a">Kegiatan</h1>
          </div>
          <div className="h-12 rounded-xl flex items-center bg-accent1a/50">
            page-specific form
          </div>
        </div>
      </div>
      <div className="flex-col">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </div>
  );
}
