"use client";

import { useState } from "react";
import { CATEGORIES, categoryDot, categoryLabel, type Category } from "./categories";
import { useDeleteTransaction, useUpdateTransaction } from "./use-transactions";
import type { Transaction } from "./types";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function toDateInputValue(date: string) {
  return date.slice(0, 10);
}

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [date, setDate] = useState(toDateInputValue(transaction.date));
  const [description, setDescription] = useState(transaction.description);
  const [category, setCategory] = useState<Category>(transaction.category);

  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateTransaction.mutate(
      { id: transaction.id, data: { amount: parseFloat(amount), date, description, category } },
      { onSuccess: () => setIsEditing(false) },
    );
  }

  function handleCancel() {
    setAmount(String(transaction.amount));
    setDate(toDateInputValue(transaction.date));
    setDescription(transaction.description);
    setCategory(transaction.category);
    setIsEditing(false);
  }

  function handleDelete() {
    if (confirm("Excluir esta transação?")) {
      deleteTransaction.mutate(transaction.id);
    }
  }

  if (isEditing) {
    return (
      <li className="border-b border-line py-4 first:pt-0 last:border-b-0">
        <form onSubmit={handleSave} className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-28 rounded-md border border-line bg-surface px-2 py-1.5 font-mono text-sm text-ink outline-none focus:border-accent"
            />
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-w-0 flex-1 rounded-md border border-line bg-surface px-2 py-1.5 text-sm text-ink outline-none focus:border-accent"
            />
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-line bg-surface px-2 py-1.5 text-sm text-ink outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                aria-pressed={category === c.value}
                onClick={() => setCategory(c.value)}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  category === c.value
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-line text-ink-soft hover:border-accent"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} aria-hidden />
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={updateTransaction.isPending}
              className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateTransaction.isPending ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-soft hover:border-accent"
            >
              Cancelar
            </button>
          </div>

          {updateTransaction.isError && (
            <p className="text-sm text-danger">Não foi possível salvar. Tente de novo.</p>
          )}
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-4 border-b border-line py-4 first:pt-0 last:border-b-0">
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

      <div className="flex shrink-0 items-center gap-3">
        <p className="font-mono tabular-nums text-ink">{currency.format(transaction.amount)}</p>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-sm text-ink-soft hover:text-accent"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteTransaction.isPending}
          className="text-sm text-ink-soft hover:text-danger disabled:opacity-60"
        >
          Excluir
        </button>
      </div>
    </li>
  );
}
