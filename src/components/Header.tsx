"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { SidebarToggleButton, ThemeToggleButton } from "./Toggles";
import { motion } from "motion/react";
import { logoText } from "@/lib/constants";

export default function Header() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
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

        <div className="flex-1 sm:hidden short:flex items-center gap-2">
          <motion.svg
            key="logo"
            width="56"
            height="56"
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
        </div>

        <div className="flex gap-4">
          {/* 👇 Login or Logout Button */}
          {userRole === "admin" ? (
            <button
              onClick={handleLogout}
              className="h-8 px-4 rounded-full bg-no text-background1 hover:bg-no/50 text-sm"
            >
              Keluar
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="h-8 px-4 rounded-full bg-accent1b text-background1 hover:bg-accent1a text-sm"
            >
              Masuk
            </button>
          )}

          <ThemeToggleButton />
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-background2 p-6 rounded-xl shadow-lg w-80 space-y-4">
            <h2 className="text-lg font-semibold text-accent2b">Masuk Admin</h2>
            <p>Hanya untuk pengelola aplikasi</p>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 rounded-md border text-sm border-border bg-background1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 rounded-md border text-sm border-border bg-background1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLogin(false)}
                className="text-sm px-4 py-1 rounded-md border border-border text-text2 hover:bg-background1"
              >
                Batal
              </button>
              <button
                onClick={handleLogin}
                className="text-sm px-4 py-1 rounded-md bg-accent1b text-background1 hover:bg-accent1a"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
