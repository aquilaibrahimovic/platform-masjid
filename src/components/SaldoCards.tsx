"use client";

const mockSaldoBank = 96_597_273;
const mockDeposito = 110_000_000;

type SaldoCardsProps = {
  currentSaldo: number;
};

type SaldoKey = "kas" | "bank" | "deposito" | "total";

const cards: { label: string; key: SaldoKey }[] = [
  { label: "Kas", key: "kas" },
  { label: "Bank", key: "bank" },
  { label: "Deposito", key: "deposito" },
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 select-none">
      {cards.map((card, index) => {
        const formatted = values[card.key].toLocaleString("id-ID");
        const [main, last] = formatted
          .match(/([\d.]+)\.(\d{3})$/)
          ?.slice(1) || [formatted, ""];

        return (
          <div
            key={card.key}
            className={`seamless-card seamless-card-${
              index + 1
            } rounded-2xl p-4 flex flex-col justify-center gap-1 shadow-md text-text2`}
          >
            <span className="text-sm text-accent2b font-bold">
              {card.label}
            </span>
            <span className="text-2xl lg:text-base xl:text-2xl font-sans font-semibold text-right">
              <sup className="text-accent2b text-sm">Rp</sup>
              {main}
              <span className="text-sm">.{last}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
