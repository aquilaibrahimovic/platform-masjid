"use client";

import WeeklyReport from "@/components/WeeklyReport";
import { useState } from "react";

type Transaksi = {
  id: number;
  tanggal: string;
  keterangan: string;
  pemasukan: number;
  pengeluaran: number;
  saldo: number;
};

function HomePage() {
  const [date] = useState(new Date());
  const [allData] = useState<Transaksi[]>([]);
  return <WeeklyReport date={date} allData={allData} />;
}

export default HomePage;
