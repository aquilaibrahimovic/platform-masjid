"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { MENU_ITEMS } from "@/lib/constants";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Rows3,
  FilePlus2,
  FileMinus2,
  WalletMinimal,
  Info,
} from "lucide-react";
import WeeklyReport from "@/components/WeeklyReport";
import MonthlyEvaluation from "@/components/MonthlyEvaluation";
import SaldoCards from "@/components/SaldoCards";
import { Transaksi } from "@/types/transaksi";
import FinancialTracking from "@/components/FinancialTracking";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function KeuanganPage() {
  const keuanganItem = MENU_ITEMS.find((item) => item.label === "Keuangan");
  const KeuanganIcon = keuanganItem?.icon;

  const [date, setDate] = useState(new Date());
  const [allData, setAllData] = useState<Transaksi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const KOREKSI_SALDO = 1252000;

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("transaksi")
        .select("*")
        .order("tanggal", { ascending: true });

      if (!error && data) {
        let runningSaldo = KOREKSI_SALDO;

        const withSaldo = data.map((trx: Transaksi, index: number) => {
          const pemasukan = trx.pemasukan || 0;
          const pengeluaran = trx.pengeluaran || 0;

          // For the first row, apply KOREKSI_SALDO before calculating saldo
          runningSaldo += pemasukan - pengeluaran;
          console.log(
            `Row ${index}: +${trx.pemasukan} -${trx.pengeluaran} = Saldo ${runningSaldo}`
          );

          return {
            ...trx,
            saldo: runningSaldo,
          };
        });

        setAllData(withSaldo);
      }

      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  const dataWithSaldo = useMemo(() => {
    return allData.filter((trx) => {
      const trxDate = new Date(trx.tanggal);
      return (
        trxDate.getFullYear() === date.getFullYear() &&
        trxDate.getMonth() === date.getMonth()
      );
    });
  }, [allData, date]);

  const handlePrevMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const totalPemasukan = dataWithSaldo.reduce(
    (sum: number, trx: Transaksi) => sum + (trx.pemasukan || 0),
    0
  );
  const totalPengeluaran = dataWithSaldo.reduce(
    (sum: number, trx: Transaksi) => sum + (trx.pengeluaran || 0),
    0
  );

  const namaBulan = format(date, "LLLL", { locale: id });

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-background1 rounded-bl-2xl sticky top-16 z-30">
        <div className="flex flex-1 bg-background2 rounded-2xl h-14 justify-between items-center shadow-md pr-4">
          <div className="flex gap-2 items-center">
            <div className="h-14 w-14 bg-accent2b rounded-2xl flex items-center justify-center">
              {KeuanganIcon && <KeuanganIcon className="w-6 h-6 text-white" />}
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-accent2b">
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
      <div
        className="grid gap-4 
              md:grid-cols-[2fr_1fr] 
              md:auto-rows-min
              md:grid-rows-[auto_auto]"
      >
        <div className="md:row-start-1 md:col-start-1">
          <WeeklyReport date={date} allData={allData} />
        </div>

        <div className="md:row-start-1 md:row-span-2 md:col-start-2">
          <MonthlyEvaluation
            pemasukan={totalPemasukan}
            pengeluaran={totalPengeluaran}
            date={date}
          />
        </div>

        <div className="md:row-start-2 md:col-start-1">
          <SaldoCards currentSaldo={dataWithSaldo.at(-1)?.saldo ?? 0} />
        </div>
      </div>

      <div className="bg-background2 p-4 rounded-xl">
        {isLoading ? (
          <div className="text-sm text-text2">Memuat data...</div>
        ) : dataWithSaldo.length > 0 ? (
          <>
            <div className="flex w-full justify-between items-center mb-4">
              <h2 className="text-accent1a font-semibold">Transaksi Harian</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`h-8 w-8 flex justify-center items-center rounded-full text-sm ${
                    viewMode === "grid"
                      ? "bg-accent1b text-background1"
                      : "bg-background1 hover:bg-accent1a/20"
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`h-8 w-8 flex justify-center items-center rounded-full text-sm ${
                    viewMode === "table"
                      ? "bg-accent1b text-background1"
                      : "bg-background1 hover:bg-accent1a/20"
                  }`}
                >
                  <Rows3 size={16} />
                </button>
              </div>
            </div>

            {/* Keep your table/grid logic here as is */}
            {viewMode === "table" ? (
              <div className="rounded-2xl overflow-x-auto">
                <div className="flex flex-col gap-0.5 min-w-[640px]">
                  {/* Header */}
                  <div className="grid grid-cols-[minmax(150px,auto)_104px_88px_88px_88px_72px] text-sm font-semibold text-text1 bg-background1 px-4 py-2">
                    <div>Keterangan</div>
                    <div>Tanggal</div>
                    <div className="text-right">Masuk</div>
                    <div className="text-right">Keluar</div>
                    <div className="text-right">Saldo</div>
                    <div className="text-center">Nota</div>
                  </div>

                  {/* Body */}
                  {dataWithSaldo.map((trx) => (
                    <div
                      key={trx.id}
                      className="grid grid-cols-[minmax(150px,auto)_104px_88px_88px_88px_72px] text-sm text-text1 bg-background3 hover:bg-background1/25 px-4 py-2 font-normal items-center"
                    >
                      <div>{trx.keterangan}</div>
                      <div className="text-right">
                        {format(parseISO(trx.tanggal), "EEE, dd LLL yy", {
                          locale: id,
                        })}
                      </div>
                      <div
                        className={`text-right font-mono ${
                          trx.pemasukan ? "text-yes" : "text-text1"
                        }`}
                      >
                        {trx.pemasukan
                          ? trx.pemasukan.toLocaleString("id-ID")
                          : "-"}
                      </div>
                      <div
                        className={`text-right font-mono ${
                          trx.pengeluaran ? "text-no" : "text-text1"
                        }`}
                      >
                        {trx.pengeluaran
                          ? trx.pengeluaran.toLocaleString("id-ID")
                          : "-"}
                      </div>
                      <div
                        className={`text-right font-mono ${
                          trx.saldo >= 0 ? "text-text1" : "text-no"
                        }`}
                      >
                        {trx.saldo.toLocaleString("id-ID")}
                      </div>
                      <div className="text-center">
                        <button className="bg-background1 hover:bg-accent1a hover:text-background1 rounded-full py-1 px-4">
                          Nota
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-[minmax(150px,auto)_96px_88px_88px_88px_72px] text-sm text-background1 font-semibold bg-accent2b px-4 py-2">
                    <div className="col-span-2">
                      Total Mutasi Bulan {namaBulan}
                    </div>
                    <div className="text-right font-mono text-background1">
                      {totalPemasukan.toLocaleString("id-ID")}
                    </div>
                    <div className="text-right font-mono text-background1">
                      {totalPengeluaran.toLocaleString("id-ID")}
                    </div>
                    <div /> {/* Empty saldo column */}
                    <div /> {/* Empty nota column */}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                <>
                  {dataWithSaldo.map((trx) => (
                    <div
                      key={trx.id}
                      className="grid grid-cols-2 bg-background3 p-4 rounded-xl text-sm gap-y-0.5 shadow-md"
                    >
                      {/* Row 1: Keterangan full width */}
                      <div className="flex justify-start items-center col-span-2 font-semibold text-lg text-text1 h-10">
                        {trx.keterangan}
                      </div>

                      {/* Row 2: Tanggal and Masuk/Keluar */}
                      <div className="flex justify-start items-center text-text1 h-8">
                        {format(parseISO(trx.tanggal), "EEEE, dd LLL yyyy", {
                          locale: id,
                        })}
                      </div>
                      <div className="flex justify-end items-center gap-2">
                        {trx.pemasukan ? (
                          <FilePlus2 size={20} className="text-yes" />
                        ) : trx.pengeluaran ? (
                          <FileMinus2 size={20} className="text-no" />
                        ) : null}

                        <div
                          className={`flex justify-end items-center text-right font-mono h-8 w-20 ${
                            trx.pemasukan
                              ? "text-yes"
                              : trx.pengeluaran
                              ? "text-no"
                              : "text-text1"
                          }`}
                        >
                          {trx.pemasukan || trx.pengeluaran
                            ? (trx.pemasukan || trx.pengeluaran).toLocaleString(
                                "id-ID"
                              )
                            : "-"}
                        </div>
                      </div>

                      {/* Row 3: Nota and Saldo */}
                      <div className="pt-1">
                        <button className="bg-background1 hover:bg-accent1a hover:text-background1 rounded-full py-1 px-4">
                          Nota
                        </button>
                      </div>
                      <div className="flex justify-end items-center gap-2">
                        <WalletMinimal size={20} className="text-accent2b" />
                        <div
                          className={`flex justify-end items-center text-right font-mono pt-1 w-20 ${
                            trx.saldo >= 0 ? "text-text1" : "text-no"
                          }`}
                        >
                          {trx.saldo.toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Grid summary row */}
                  <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
                    <div className="flex flex-col md:flex-row gap-2 mt-4 text-sm text-text1 font-semibold">
                      <div className="flex justify-between bg-background3 p-3 rounded-xl w-full md:w-1/2">
                        <span>Total Pemasukan Bulan {namaBulan}</span>
                        <span className="font-mono text-yes">
                          {totalPemasukan.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between bg-background3 p-3 rounded-xl w-full md:w-1/2">
                        <span>Total Pengeluaran Bulan {namaBulan}</span>
                        <span className="font-mono text-no">
                          {totalPengeluaran.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              </div>
            )}
          </>
        ) : (
          <div className="w-full text-text2 text-sm font-medium rounded-xl flex items-center gap-2">
            <Info className="w-5 h-5 text-accent1a" />
            Tidak ada transaksi pada Bulan{" "}
            {format(date, "MMMM yyyy", { locale: id })}
          </div>
        )}
      </div>
      <FinancialTracking allData={allData} />
    </div>
  );
}
