"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { categoryDot, categoryLabel } from "./categories";
import { UnauthorizedError, useTransactions } from "./use-transactions";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function TransactionsList() {
  const router = useRouter();
  const { data: transactions, isLoading, isError, error } = useTransactions();

  useEffect(() => {
    if (error instanceof UnauthorizedError) router.push("/login");
  }, [error, router]);

  if (isLoading) return <p className="text-sm text-ink-soft">Carregando...</p>;

  if (isError) {
    if (error instanceof UnauthorizedError) return null;
    return (
      <p className="rounded-md border border-line bg-surface px-5 py-4 text-sm text-ink-soft">
        Não foi possível carregar as transações. Confira se o backend está no ar.
      </p>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-line px-5 py-8 text-center text-sm text-ink-soft">
        Nenhuma transação ainda. Adicione a primeira ao lado.
      </p>
    );
  }

  return (
    <ul>
      {transactions
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((transaction) => (
          <li
            key={transaction.id}
            className="flex items-center justify-between gap-4 border-b border-line py-4 first:pt-0 last:border-b-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${categoryDot(transaction.category)}`}
                aria-hidden
              />
              <div className="min-w-0">
                <p className="truncate text-ink">{transaction.description}</p>
                <p className="text-sm text-ink-soft">
                  {categoryLabel(transaction.category)} ·{" "}
                  {new Date(transaction.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </p>
              </div>
            </div>
            <p className="shrink-0 font-mono tabular-nums text-ink">
              {currency.format(transaction.amount)}
            </p>
          </li>
        ))}
    </ul>
  );
}
