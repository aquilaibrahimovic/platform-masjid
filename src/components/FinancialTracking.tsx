"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Transaksi } from "@/types/transaksi";
import { format, parseISO, subDays, subMonths, subYears } from "date-fns";
import { id } from "date-fns/locale";

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

  const filtered = useMemo(() => {
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

    return allData.filter((trx) => new Date(trx.tanggal) >= from);
  }, [range, allData]);

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
    saldo: "var(--color-accent1a)",
  };

  const formatJuta = (value: number) =>
    `${(value / 1_000_000).toFixed(1).replace(".", ",")}J`;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeData =
    activeIndex != null ? chartData[activeIndex] : chartData.at(-1);

  return (
    <div className="bg-background2 p-4 rounded-xl w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-accent1a font-semibold">Analisis Keuangan</h2>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="rounded-md border text-sm px-2 py-1 text-text1 bg-background1 border-border"
        >
          {rangeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Chart */}
        <div className="w-full md:w-full h-[300px]">
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

              <CartesianGrid strokeDasharray="3 3" />

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
        <div className="w-full md:w-fit flex md:flex-col justify-between md:justify-center gap-2 text-sm">
          {[
            { name: "Pemasukan", color: COLORS.pemasukan },
            { name: "Pengeluaran", color: COLORS.pengeluaran },
            { name: "Saldo", color: COLORS.saldo },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-start gap-2"
            >
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-text1">{item.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-2 text-sm font-mono text-text1">
          {activeData ? (
            <div className="flex flex-col md:flex-row md:items-center md:gap-6">
              <div className="font-sans font-semibold text-text2 w-36 md:w-auto">
                {activeData.tanggal}
              </div>
              <div className="flex flex-col md:flex-row gap-1 md:gap-10">
                <div className="flex justify-between">
                  <span>Pemasukan</span>
                  <span className="text-yes">
                    Rp. {activeData.pemasukan.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pengeluaran</span>
                  <span className="text-no">
                    Rp. {activeData.pengeluaran.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Saldo</span>
                  <span className="text-accent1a">
                    Rp. {activeData.saldo.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
