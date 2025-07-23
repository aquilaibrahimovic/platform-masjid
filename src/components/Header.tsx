"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { SidebarToggleButton, ThemeToggleButton } from "./Toggles";
import { motion } from "motion/react";
import { logoText } from "@/lib/constants";
import LoginModal from "./LoginModal";
import { LogIn, LogOut } from "lucide-react";

export default function Header() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserRole(user.user_metadata?.role ?? null);
      }
    };
    getUser();
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      location.reload();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <>
      <div className="flex h-16 justify-between items-center px-4 gap-2 bg-background1">
        <SidebarToggleButton />

        <div className="flex-1 sm:hidden short:flex items-center relative">
          <motion.svg
            key="logo"
            width="56"
            height="56"
            transform="scale(0.75)"
            viewBox="0 0 56 56"
            animate={{
              fill: [
                "var(--color-accent1a)",
                "var(--color-accent2b)",
                "var(--color-text1)",
                "var(--color-accent1b)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <use href="/images/sprites.svg#logo-masjid" />
          </motion.svg>
          <div
            className="absolute top-1 left-13 w-39 h-14 flex flex-col justify-center"
            style={{ lineHeight: 1 }}
          >
            <div className="font-special text-sm font-bold text-text3 leading-0.5">
              {logoText.line1}
            </div>
            <div className="font-special text-xl font-medium text-accent1b">
              {logoText.line2}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {/* 👇 Login or Logout Button */}
          {userRole === "admin" ? (
            <button
              onClick={handleLogout}
              className="h-8 w-8 rounded-full bg-no text-background1 hover:bg-no/75 flex justify-center items-center"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="h-8 w-8 rounded-full bg-accent1b text-background1 hover:bg-accent1a flex justify-center items-center"
            >
              <LogIn className="w-5 h-5" />
            </button>
          )}
          <LoginModal
            open={showLoginModal}
            onClose={() => setShowLoginModal(false)}
          />
          <ThemeToggleButton />
        </div>
      </div>
    </>
  );
}
