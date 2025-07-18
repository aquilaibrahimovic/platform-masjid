"use client";

const mockSaldoBank = 100_000_000;
const mockDeposito = 100_000_000;

type SaldoCardsProps = {
  currentSaldo: number;
};

export default function SaldoCards({ currentSaldo }: SaldoCardsProps) {
  const total = currentSaldo + mockSaldoBank + mockDeposito;

  const cards = [
    { label: "Saldo Kas", value: currentSaldo },
    { label: "Saldo Bank", value: mockSaldoBank },
    { label: "Saldo Deposito", value: mockDeposito },
    { label: "Total Saldo", value: total },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-background3 rounded-xl p-4 flex flex-col gap-1 shadow-sm"
        >
          <span className="text-sm text-text2">{card.label}</span>
          <span className="text-lg font-mono font-semibold text-text1">
            Rp. {card.value.toLocaleString("id-ID")}
          </span>
        </div>
      ))}
    </div>
  );
}
