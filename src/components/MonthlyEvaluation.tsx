"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronUp, ChevronDown, CircleSmall } from "lucide-react";

type MonthlyEvaluationProps = {
  pemasukan: number;
  pengeluaran: number;
  date: Date;
};

const COLORS = {
  pemasukan: "var(--color-yes)",
  pengeluaran: "var(--color-no)",
};

export default function MonthlyEvaluation({
  pemasukan,
  pengeluaran,
  date,
}: MonthlyEvaluationProps) {
  const data = [
    { name: "Pemasukan", value: pemasukan, color: COLORS.pemasukan },
    { name: "Pengeluaran", value: pengeluaran, color: COLORS.pengeluaran },
  ];

  const bulan = format(date, "MMMM", { locale: id });
  const tahun = format(date, "yyyy", { locale: id });

  const selisih = pemasukan - pengeluaran;
  const selisihJuta = Math.round((selisih / 1_000_000) * 10) / 10; // 1 decimal

  let colorClass = "text-text1";
  if (selisihJuta > 0) colorClass = "text-yes";
  else if (selisihJuta < 0) colorClass = "text-no";

  return (
    <div className="bg-background2 rounded-2xl w-full min-w-62 h-full flex flex-col overflow-hidden">
      <div className="p-4 pb-0 flex flex-col">
        <h2 className="text-accent2b font-semibold">Evaluasi Bulanan</h2>

        <div className="relative h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[52%] flex flex-col items-center leading-none">
            <div className={`text-4xl font-sans font-bold ${colorClass}`}>
              {Math.abs(selisihJuta).toLocaleString("id-ID", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </div>
            <div className="flex items-center text-sm font-bold text-text3">
              {selisih > 0 ? (
                <ChevronUp className="w-4 h-4 text-yes" />
              ) : selisih < 0 ? (
                <ChevronDown className="w-4 h-4 text-no" />
              ) : (
                <CircleSmall className="w-4 h-4 text-text3" />
              )}
              <span>Juta</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-text1 mb-2">
            Neraca Bulan {bulan} {tahun}
          </h3>

          <div className="flex flex-col gap-2 text-sm mb-4">
            {data.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-text1">{item.name}</span>
                </div>
                <div className="font-mono">
                  Rp. {item.value.toLocaleString("id-ID")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Difference row */}
      <div
        className={`relative flex flex-row md:flex-col lg:flex-row items-center justify-between md:justify-center lg:justify-between flex-1 px-4 gap-4 overflow-hidden ${
          selisih > 0 ? "bg-yes" : selisih < 0 ? "bg-no" : "bg-background3"
        } `}
      >
        <div className="flex items-center gap-2 font-bold text-background1 text-base md:text-2xl lg:text-base z-10">
          {selisih > 0 ? "Surplus" : selisih < 0 ? "Defisit" : "Selisih"}
        </div>
        <div className="text-background1 font-mono font-bold text-base md:text-2xl lg:text-base z-10">
          Rp. {selisih.toLocaleString("id-ID")}
        </div>
      </div>
    </div>
  );
}
