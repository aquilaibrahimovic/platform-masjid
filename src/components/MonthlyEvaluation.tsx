"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type MonthlyEvaluationProps = {
  pemasukan: number;
  pengeluaran: number;
  date: Date;
};

const COLORS = {
  pemasukan: "#22c55e", // Tailwind's green-500 (text-yes)
  pengeluaran: "#ef4444", // Tailwind's red-500 (text-no)
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

  return (
    <div className="bg-background2 p-4 rounded-xl w-full min-w-62 h-full">
      <h2 className="text-accent1a font-semibold">Evaluasi Bulanan</h2>

      <ResponsiveContainer width="100%" height={240}>
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

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-text1 mb-2">
          Neraca Bulan {bulan} {tahun}
        </h3>

        <div className="flex flex-col gap-2 text-sm">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
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
  );
}
