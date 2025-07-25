"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Transaksi } from "@/types/transaksi";
import { format, parseISO, subDays, subMonths, subYears } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronRight, ChevronLeft } from "lucide-react";
import AnimatedNumber from "@/components/AnimatedNumber";

const rangeOptions = [
  { label: "7 Hari", value: "7d" },
  { label: "30 Hari", value: "30d" },
  { label: "3 Bulan", value: "3m" },
  { label: "1 Tahun", value: "1y" },
];

type FinancialTrackingProps = {
  allData: Transaksi[];
};

export default function FinancialTracking({ allData }: FinancialTrackingProps) {
  const [range, setRange] = useState("30d");

  const chartData = useMemo(() => {
    let runningSaldo = 1252000;

    // 1. Group by date (yyyy-mm-dd), summing income and expense
    const groupedMap = new Map<
      string,
      { pemasukan: number; pengeluaran: number }
    >();

    allData.forEach((trx) => {
      const key = trx.tanggal;
      const entry = groupedMap.get(key) || { pemasukan: 0, pengeluaran: 0 };
      entry.pemasukan += trx.pemasukan || 0;
      entry.pengeluaran += trx.pengeluaran || 0;
      groupedMap.set(key, entry);
    });

    // 2. Sort dates and compute saldo cumulatively
    const groupedArray = Array.from(groupedMap.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([tanggal, { pemasukan, pengeluaran }]) => {
        runningSaldo += pemasukan - pengeluaran;
        return {
          tanggalISO: tanggal,
          tanggal: format(parseISO(tanggal), "dd MMM yy", { locale: id }),
          pemasukan,
          pengeluaran,
          saldo: runningSaldo,
        };
      });

    // 3. Filter by selected range
    const now = new Date();
    let from: Date;

    switch (range) {
      case "7d":
        from = subDays(now, 7);
        break;
      case "30d":
        from = subDays(now, 30);
        break;
      case "3m":
        from = subMonths(now, 3);
        break;
      case "1y":
        from = subYears(now, 1);
        break;
      default:
        from = subDays(now, 30);
    }

    return groupedArray.filter((item) => new Date(item.tanggalISO) >= from);
  }, [range, allData]);

  // Thematic color values
  const COLORS = {
    pemasukan: "var(--color-yes)",
    pengeluaran: "var(--color-no)",
    saldo: "var(--color-accent1b)",
  };

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeData =
    activeIndex != null ? chartData[activeIndex] : chartData.at(-1);

  return (
    <div className="bg-background2 p-4 rounded-2xl w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-accent2b font-semibold">Analisis Keuangan</h2>
        <div className="flex items-center">
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center text-background1
    ${
      range === rangeOptions[0].value
        ? "bg-accent1b/50"
        : "bg-accent1b hover:bg-accent1a"
    }
  `}
            onClick={() => {
              const currentIndex = rangeOptions.findIndex(
                (opt) => opt.value === range
              );
              const prevIndex = Math.max(0, currentIndex - 1);
              setRange(rangeOptions[prevIndex].value);
            }}
            disabled={range === rangeOptions[0].value}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex text-sm font-semibold justify-center text-center w-18">
            <span>
              {rangeOptions.find((opt) => opt.value === range)?.label}
            </span>
          </div>

          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center text-background1
    ${
      range === rangeOptions[rangeOptions.length - 1].value
        ? "bg-accent1b/50"
        : "bg-accent1b hover:bg-accent1a"
    }
  `}
            onClick={() => {
              const currentIndex = rangeOptions.findIndex(
                (opt) => opt.value === range
              );
              const nextIndex = Math.min(
                rangeOptions.length - 1,
                currentIndex + 1
              );
              setRange(rangeOptions[nextIndex].value);
            }}
            disabled={range === rangeOptions[rangeOptions.length - 1].value}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 sm:gap-0">
        {/* Chart */}
        <div className="w-full md:flex-1 h-[300px] rounded-lg sm:rounded-l-lg sm:rounded-r-none shadow-md">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              onMouseMove={(e) => {
                if (e && e.activeTooltipIndex != null) {
                  setActiveIndex(Number(e.activeTooltipIndex));
                }
              }}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <defs>
                <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS.pemasukan}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.pemasukan}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS.pengeluaran}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.pengeluaran}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS.saldo}
                    stopOpacity={0.8}
                  />
                  <stop offset="95%" stopColor={COLORS.saldo} stopOpacity={0} />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="pemasukan"
                stroke={COLORS.pemasukan}
                fill="url(#colorMasuk)"
                fillOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="pengeluaran"
                stroke={COLORS.pengeluaran}
                fill="url(#colorKeluar)"
                fillOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="saldo"
                stroke={COLORS.saldo}
                fill="url(#colorSaldo)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        {activeData && (
          <div className="mt-2 text-sm text-text1 flex flex-col gap-1 w-full sm:w-64 p-4 bg-background3 rounded-lg sm:rounded-r-lg sm:rounded-l-none shadow-md">
            <div className="font-bold text-lg sm:text-2xl text-text2">
              {activeData.tanggal}
            </div>

            {[
              {
                name: "Pemasukan",
                color: COLORS.pemasukan,
                value: activeData.pemasukan,
                className: "text-yes",
              },
              {
                name: "Pengeluaran",
                color: COLORS.pengeluaran,
                value: activeData.pengeluaran,
                className: "text-no",
              },
              {
                name: "Saldo",
                color: COLORS.saldo,
                value: activeData.saldo,
                className: "text-accent1b",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="flex sm:flex-col items-center sm:items-start justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>

                <AnimatedNumber
                  value={item.value}
                  className={`text-right mb-0 sm:mb-4 w-full text-lg sm:text-xl font-semibold ${item.className}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
