"use client";

import { useMemo } from "react";
import {
  addDays,
  startOfMonth,
  subDays,
  startOfDay,
  endOfDay,
  format,
} from "date-fns";
import { id } from "date-fns/locale";

type Transaksi = {
  id: number;
  tanggal: string;
  keterangan: string;
  pemasukan: number;
  pengeluaran: number;
};

type WeeklySummary = {
  weekIndex: number;
  pemasukan: number;
  pengeluaran: number;
};

type WeeklyReportProps = {
  date: Date;
  allData: Transaksi[];
};

export default function WeeklyReport({ date, allData }: WeeklyReportProps) {
  const weeklyData: WeeklySummary[] = useMemo(() => {
    const startDate = startOfMonth(date);
    const firstSaturday = subDays(startDate, (startDate.getDay() + 1) % 7);

    const weeks: WeeklySummary[] = [];

    for (let i = 0; i < 5; i++) {
      const rawStart = addDays(firstSaturday, i * 7);
      const rawEnd = addDays(rawStart, 6);

      const weekStart = startOfDay(rawStart);
      const weekEnd = endOfDay(rawEnd);

      // Only include if the *Friday* (end of the week) is still within the current month
      if (weekEnd.getMonth() !== date.getMonth()) {
        break;
      }

      const filtered = allData.filter((trx) => {
        const trxDate = new Date(trx.tanggal);
        return trxDate >= weekStart && trxDate <= weekEnd;
      });

      const pemasukan = filtered.reduce(
        (sum, trx) => sum + (trx.pemasukan || 0),
        0
      );
      const pengeluaran = filtered.reduce(
        (sum, trx) => sum + (trx.pengeluaran || 0),
        0
      );

      weeks.push({
        weekIndex: i + 1,
        pemasukan,
        pengeluaran,
      });
    }

    return weeks;
  }, [allData, date]);

  const namaBulan = format(date, "MMMM yyyy", { locale: id });

  return (
    <div className="bg-background2 p-4 rounded-xl mt-4">
      <h2 className="text-accent1a font-semibold mb-4">
        Laporan Mingguan ({namaBulan})
      </h2>

      <div className="rounded-2xl overflow-x-auto">
        <div className="flex flex-col gap-0.5 w-full">
          <div className="grid grid-cols-[1fr_2fr_2fr] text-sm font-semibold text-text1 bg-background1 px-4 py-2 w-full">
            <div>Jumat</div>
            <div className="text-right">Masuk</div>
            <div className="text-right">Keluar</div>
          </div>

          {Array.from({ length: 5 }).map((_, i) => {
            const week = weeklyData.find((w) => w.weekIndex === i + 1);

            return (
              <div
                key={i}
                className="grid grid-cols-[1fr_2fr_2fr] text-sm text-text1 bg-background3 hover:bg-background1/25 px-4 py-2 font-normal items-center w-full"
              >
                <div>{week ? week.weekIndex : "-"}</div>
                <div className="text-right font-mono text-yes">
                  {week ? week.pemasukan.toLocaleString("id-ID") : "-"}
                </div>
                <div className="text-right font-mono text-no">
                  {week ? week.pengeluaran.toLocaleString("id-ID") : "-"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
