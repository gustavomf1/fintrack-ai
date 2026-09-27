"use client";

import { categoryLabel, categorySoftClass, categoryTextClass } from "./categories";
import { useDeleteTransaction } from "./use-transactions";
import type { Transaction } from "./types";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function TransactionItem({
  transaction,
  isEditing,
  onEdit,
}: {
  transaction: Transaction;
  isEditing: boolean;
  onEdit: (transaction: Transaction) => void;
}) {
  const deleteTransaction = useDeleteTransaction();

  function handleDelete() {
    if (confirm("Excluir esta transação?")) {
      deleteTransaction.mutate(transaction.id);
    }
  }

  return (
    <div
      className={`flex items-center gap-3.5 border-t border-line px-6 py-3.5 transition-colors first:border-t-0 ${
        isEditing ? "bg-muted" : "hover:bg-elevated"
      }`}
    >
      <div
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-sm font-bold ${categoryTextClass(transaction.category)} ${categorySoftClass(transaction.category)}`}
      >
        {transaction.description.trim()[0]?.toUpperCase() ?? "?"}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{transaction.description}</p>
        <p className="text-xs text-ink-soft">{categoryLabel(transaction.category)}</p>
      </div>

      <p className="shrink-0 whitespace-nowrap font-mono text-[15px] font-semibold text-ink">
        {currency.format(transaction.amount)}
      </p>

      <div className="flex shrink-0 gap-0.5">
        <button
          type="button"
          onClick={() => onEdit(transaction)}
          title="Editar"
          className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-muted hover:text-ink"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteTransaction.isPending}
          title="Excluir"
          className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-danger/15 hover:text-danger disabled:opacity-60"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
