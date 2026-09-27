"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TransactionItem } from "./transaction-item";
import { UnauthorizedError, useTransactions } from "./use-transactions";

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
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
    </ul>
  );
}
