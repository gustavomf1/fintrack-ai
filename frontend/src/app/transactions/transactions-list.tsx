"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TransactionItem } from "./transaction-item";
import type { Transaction } from "./types";
import { UnauthorizedError, useTransactions } from "./use-transactions";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function groupLabel(isoDate: string) {
  const key = isoDate.slice(0, 10);
  const today = dateKey(new Date());
  const yesterday = dateKey(new Date(Date.now() - 86_400_000));

  if (key === today) return "Hoje";
  if (key === yesterday) return "Ontem";

  return new Date(`${key}T00:00:00`)
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    .replace(".", "");
}

function groupTransactions(transactions: Transaction[]) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const groups = new Map<string, Transaction[]>();
  for (const transaction of sorted) {
    const label = groupLabel(transaction.date);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(transaction);
  }

  return [...groups.entries()].map(([label, items]) => ({
    label,
    items,
    total: items.reduce((sum, t) => sum + t.amount, 0),
  }));
}

export function TransactionsList({
  editingId,
  onEdit,
}: {
  editingId: string | null;
  onEdit: (transaction: Transaction) => void;
}) {
  const router = useRouter();
  const { data: transactions, isLoading, isError, error } = useTransactions();

  useEffect(() => {
    if (error instanceof UnauthorizedError) router.push("/login");
  }, [error, router]);

  return (
    <section className="rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <span className="text-[15px] font-bold text-ink">Transações recentes</span>
        {transactions && (
          <span className="text-xs text-ink-soft">
            {transactions.length} {transactions.length === 1 ? "transação" : "transações"}
          </span>
        )}
      </div>

      {isLoading && <p className="px-6 py-10 text-center text-sm text-ink-soft">Carregando...</p>}

      {isError && !(error instanceof UnauthorizedError) && (
        <p className="px-6 py-10 text-center text-sm text-ink-soft">
          Não foi possível carregar as transações. Confira se o backend está no ar.
        </p>
      )}

      {transactions && transactions.length === 0 && (
        <p className="px-6 py-12 text-center text-sm text-ink-soft">Nenhuma transação ainda.</p>
      )}

      {transactions &&
        transactions.length > 0 &&
        groupTransactions(transactions).map((group) => (
          <div key={group.label}>
            <div className="flex items-center justify-between bg-elevated px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <span>{group.label}</span>
              <span className="font-mono normal-case tracking-normal">
                {currency.format(group.total)}
              </span>
            </div>
            {group.items.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                isEditing={transaction.id === editingId}
                onEdit={onEdit}
              />
            ))}
          </div>
        ))}
    </section>
  );
}
