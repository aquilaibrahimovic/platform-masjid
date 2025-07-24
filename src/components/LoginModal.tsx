"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { FcLock } from "react-icons/fc";
import { motion, AnimatePresence } from "motion/react";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setErrorMsg(error.message);
    } else {
      location.reload();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-80 bg-background2 p-6 rounded-xl shadow-lg space-y-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
          >
            <FcLock className="text-6xl m-auto" />
            <h2 className="text-lg text-center font-semibold text-accent2b">
              Masuk Admin
            </h2>
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
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="text-sm px-4 py-1 rounded-md border border-border text-text2 hover:bg-background1"
              >
                Batal
              </button>
              <button
                onClick={handleLogin}
                className="text-sm px-4 py-1 rounded-md bg-accent1b text-background1 hover:bg-accent1a"
              >
                Login
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
