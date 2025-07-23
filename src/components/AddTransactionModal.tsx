"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { format } from "date-fns";
import LocalizedDatePicker from "./LocalizedDatePicker";
import { motion, AnimatePresence } from "motion/react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddTransactionModal({ open, onClose }: Props) {
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState(() =>
    format(new Date(), "yyyy-MM-dd")
  );
  const [dateObj, setDateObj] = useState(() => new Date(tanggal));
  const [tipe, setTipe] = useState<"masuk" | "keluar">("masuk");
  const [nilai, setNilai] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    const numericValue = parseInt(nilai.replace(/[^0-9]/g, ""));
    if (!keterangan || isNaN(numericValue))
      return alert("Lengkapi semua data.");

    setIsLoading(true);
    const { error } = await supabase.from("transaksi").insert([
      {
        keterangan,
        tanggal,
        pemasukan: tipe === "masuk" ? numericValue : null,
        pengeluaran: tipe === "keluar" ? numericValue : null,
      },
    ]);
    setIsLoading(false);

    if (error) {
      alert("Gagal menambahkan transaksi: " + error.message);
    } else {
      onClose();
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
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal Box */}
          <motion.div
            className="relative z-10 bg-background2 p-6 rounded-xl shadow-lg w-96 space-y-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-accent2b">
              Tambah Transaksi
            </h2>

            <input
              type="text"
              placeholder="Keterangan"
              className="w-full px-3 py-2 rounded-md border text-sm border-border bg-background1"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            />

            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <LocalizedDatePicker
                  selected={dateObj}
                  onSelect={(d) => {
                    setDateObj(d);
                    setTanggal(format(d, "yyyy-MM-dd"));
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setDateObj(today);
                  setTanggal(format(today, "yyyy-MM-dd"));
                }}
                className="px-3 py-2 rounded-md border text-sm border-border bg-background1 hover:bg-accent1a hover:text-background1 whitespace-nowrap"
              >
                Hari ini
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                className={`flex-1 py-2 rounded-md text-sm border ${
                  tipe === "masuk"
                    ? "bg-yes text-white border-yes"
                    : "bg-background1 text-text1 border-border"
                }`}
                onClick={() => setTipe("masuk")}
              >
                Masuk
              </button>
              <button
                className={`flex-1 py-2 rounded-md text-sm border ${
                  tipe === "keluar"
                    ? "bg-no text-white border-no"
                    : "bg-background1 text-text1 border-border"
                }`}
                onClick={() => setTipe("keluar")}
              >
                Keluar
              </button>
            </div>

            <input
              type="text"
              placeholder="Nilai"
              className="w-full px-3 py-2 rounded-md border text-sm border-border bg-background1"
              value={nilai}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                const formatted = parseInt(raw || "0").toLocaleString("id-ID");
                setNilai(formatted);
              }}
            />

            <div className="flex justify-between">
              <button className="text-sm px-4 py-1 rounded-md border border-border text-text2 hover:bg-background1">
                Nota
              </button>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="text-sm px-4 py-1 rounded-md border border-border text-text2 hover:bg-background1"
                >
                  Batalkan
                </button>
                <button
                  onClick={handleAdd}
                  disabled={isLoading}
                  className="text-sm px-4 py-1 rounded-md bg-accent1b text-background1 hover:bg-accent1a"
                >
                  Tambahkan
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
