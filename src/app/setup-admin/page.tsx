"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function SetupAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setStatus(`❌ ${error.message}`);
    } else {
      setStatus("✅ Sign-up successful. Now set role=admin in Supabase.");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Create Admin User</h1>
      <input
        className="w-full border px-3 py-2 rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border px-3 py-2 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-accent1b text-white px-4 py-2 rounded"
        onClick={handleSignUp}
      >
        Create Admin
      </button>
      {status && <p className="text-sm mt-2">{status}</p>}
    </div>
  );
}
