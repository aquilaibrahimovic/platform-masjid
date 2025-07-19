"use client";

const mockSaldoBank = 100_000_000;
const mockDeposito = 100_000_000;

type SaldoCardsProps = {
  currentSaldo: number;
};

type SaldoKey = "kas" | "bank" | "deposito" | "total";

const cards: { label: string; key: SaldoKey }[] = [
  { label: "Saldo Kas", key: "kas" },
  { label: "Saldo Bank", key: "bank" },
  { label: "Saldo Deposito", key: "deposito" },
  { label: "Total Saldo", key: "total" },
];

export default function SaldoCards({ currentSaldo }: SaldoCardsProps) {
  const values = {
    kas: currentSaldo,
    bank: mockSaldoBank,
    deposito: mockDeposito,
    total: currentSaldo + mockSaldoBank + mockDeposito,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, index) => (
        <div
          key={card.key}
          className={`seamless-card seamless-card-${
            index + 1
          } rounded-xl p-4 flex flex-col justify-center gap-1 shadow-md text-text2`}
        >
          <span className="text-sm text-text1">{card.label}</span>
          <span className="text-lg font-mono font-semibold">
            {values[card.key].toLocaleString("id-ID")}
          </span>
        </div>
      ))}
    </div>
  );
}
