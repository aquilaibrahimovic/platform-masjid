import { SidebarToggleButton, ThemeToggleButton } from "./Toggles";

export default function Header() {
  return (
    <div className="flex justify-between items-center p-4 bg-background1/50 backdrop-blur">
      <SidebarToggleButton />
      <ThemeToggleButton />
    </div>
  );
}
