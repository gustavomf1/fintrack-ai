"use client";

import { CATEGORIES, categoryLabel } from "./categories";
import { useTransactions } from "./use-transactions";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const monthLabel = new Date()
  .toLocaleDateString("pt-BR", { month: "long" })
  .replace(/^\p{L}/u, (c) => c.toLowerCase());

export function SummaryBar() {
  const { data: transactions } = useTransactions();

  if (!transactions) return null;

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const countLabel = `${transactions.length} ${transactions.length === 1 ? "transação" : "transações"}`;

  const totalsByCategory = new Map<string, number>();
  transactions.forEach((t) => {
    totalsByCategory.set(t.category, (totalsByCategory.get(t.category) ?? 0) + t.amount);
  });

  const breakdown = CATEGORIES.map((c) => ({
    ...c,
    amount: totalsByCategory.get(c.value) ?? 0,
  }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
          Gastos de {monthLabel}
        </span>
        <span className="font-mono text-4xl font-semibold tracking-tight text-ink">
          {currency.format(total)}
        </span>
        <span className="text-sm text-ink-soft">{countLabel}</span>
      </div>

      {breakdown.length > 0 && (
        <div className="flex min-w-[260px] flex-1 basis-[460px] flex-col gap-2.5">
          <div className="flex h-2 gap-0.5 overflow-hidden rounded-full bg-muted">
            {breakdown.map((c) => (
              <div
                key={c.value}
                className={`h-full ${c.dot}`}
                style={{ width: `${(c.amount / total) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {breakdown.map((c) => (
              <div key={c.value} className="flex items-center gap-1.5 text-xs text-ink-soft">
                <span className={`h-2 w-2 rounded-sm ${c.dot}`} aria-hidden />
                <span>{categoryLabel(c.value)}</span>
                <span className="font-mono text-ink">
                  {Math.round((c.amount / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
