"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { MENU_ITEMS } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Transaksi = {
  id: number;
  tanggal: string;
  keterangan: string;
  pemasukan: number;
  pengeluaran: number;
  saldo: number;
};

export default function KeuanganPage() {
  const keuanganItem = MENU_ITEMS.find((item) => item.label === "Keuangan");
  const KeuanganIcon = keuanganItem?.icon;

  const [date, setDate] = useState(new Date());
  const [data, setData] = useState<Transaksi[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const from = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      ).toISOString();
      const to = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).toISOString();

      const { data, error } = await supabase
        .from("transaksi")
        .select("*")
        .gte("tanggal", from)
        .lte("tanggal", to)
        .order("tanggal", { ascending: true });

      if (!error && data) {
        let saldo = 0;
        const withSaldo = data.map((trx) => {
          saldo += (trx.pemasukan || 0) - (trx.pengeluaran || 0);
          return { ...trx, saldo };
        });
        setData(withSaldo);
      }
    };

    fetchData();
  }, [date]);

  const handlePrevMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-background1 rounded-bl-2xl sticky top-16 z-30">
        <div className="flex flex-1 bg-background2 rounded-2xl h-14 justify-between items-center shadow-md pr-4">
          <div className="flex gap-2 items-center">
            <div className="h-14 w-14 bg-accent2b rounded-2xl flex items-center justify-center">
              {KeuanganIcon && <KeuanganIcon className="w-6 h-6 text-white" />}
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-accent1a">
              Keuangan
            </h1>
          </div>
          <div className="h-12 w-30 md:w-48 rounded-xl flex items-center justify-between">
            <button
              className="w-8 h-8 rounded-full bg-accent1b hover:bg-accent1a text-background1 flex items-center justify-center"
              onClick={handlePrevMonth}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Text stacked on mobile, inline on sm+ */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-1 text-sm font-semibold text-center">
              {/* Abbreviated month on mobile */}
              <span className="md:hidden">
                {format(date, "LLL", { locale: id })}
              </span>
              {/* Full month on desktop */}
              <span className="hidden md:inline">
                {format(date, "MMMM", { locale: id })}
              </span>
              <span>{format(date, "yyyy", { locale: id })}</span>
            </div>

            <button
              className="w-8 h-8 rounded-full bg-accent1b hover:bg-accent1a text-background1 flex items-center justify-center"
              onClick={handleNextMonth}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-background2 p-4 rounded-xl">
        <div className="flex w-full justify-between items-center mb-4">
          <h2 className="text-accent1a font-semibold">Transaksi Harian</h2>
          <div className="flex gap-2">
            <button>grid</button>
            <button>table</button>
          </div>
        </div>
        <div>
          <div className="rounded-2xl overflow-x-auto">
            <div className="flex flex-col gap-0.5 min-w-[640px]">
              {/* Header */}
              <div className="grid grid-cols-[minmax(150px,auto)_72px_88px_88px_88px_72px] text-sm font-semibold text-text1 bg-background1 px-4 py-2">
                <div>Keterangan</div>
                <div>Tanggal</div>
                <div className="text-right">Masuk</div>
                <div className="text-right">Keluar</div>
                <div className="text-right">Saldo</div>
                <div className="text-center">Nota</div>
              </div>

              {/* Body */}
              {data.map((trx) => (
                <div
                  key={trx.id}
                  className="grid grid-cols-[minmax(150px,auto)_72px_88px_88px_88px_72px] text-sm text-text1 bg-background3 hover:bg-background1/25 px-4 py-2 font-normal items-center"
                >
                  <div>{trx.keterangan}</div>
                  <div className="text-right">
                    {format(parseISO(trx.tanggal), "dd LLL yy", { locale: id })}
                  </div>
                  <div
                    className={`text-right font-mono ${
                      trx.pemasukan ? "text-yes" : "text-text1"
                    }`}
                  >
                    {trx.pemasukan ? trx.pemasukan.toLocaleString() : "-"}
                  </div>
                  <div
                    className={`text-right font-mono ${
                      trx.pengeluaran ? "text-no" : "text-text1"
                    }`}
                  >
                    {trx.pengeluaran ? trx.pengeluaran.toLocaleString() : "-"}
                  </div>
                  <div
                    className={`text-right font-mono ${
                      trx.saldo >= 0 ? "text-text1" : "text-no"
                    }`}
                  >
                    {trx.saldo.toLocaleString()}
                  </div>
                  <div className="text-center">
                    <button className="bg-background1 hover:bg-accent1a hover:text-background1 rounded-full py-1 px-4">
                      Nota
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
