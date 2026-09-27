"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategorySuggestionModal } from "./category-suggestion-modal";
import { CATEGORIES, type Category } from "./categories";
import type { Transaction } from "./types";
import { UnauthorizedError, useUpdateTransaction } from "./use-transactions";

function toDateInputValue(date: string) {
  return date.slice(0, 10);
}

const emptyForm = {
  amount: "",
  date: "",
  description: "",
  category: "food" as Category,
};

export function CreateTransactionForm({
  editingTransaction,
  onDoneEditing,
}: {
  editingTransaction: Transaction | null;
  onDoneEditing: () => void;
}) {
  const [amount, setAmount] = useState(
    editingTransaction ? String(editingTransaction.amount) : emptyForm.amount,
  );
  const [date, setDate] = useState(
    editingTransaction ? toDateInputValue(editingTransaction.date) : emptyForm.date,
  );
  const [description, setDescription] = useState(
    editingTransaction?.description ?? emptyForm.description,
  );
  const [category, setCategory] = useState<Category>(
    editingTransaction?.category ?? emptyForm.category,
  );
  const [error, setError] = useState<string | null>(null);
  const [pendingCreate, setPendingCreate] = useState<{
    amount: number;
    date: string;
    description: string;
  } | null>(null);
  const router = useRouter();

  const updateTransaction = useUpdateTransaction();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (editingTransaction) {
      updateTransaction.mutate(
        { id: editingTransaction.id, data: { amount: parseFloat(amount), date, description, category } },
        {
          onSuccess: onDoneEditing,
          onError: (err) => {
            if (err instanceof UnauthorizedError) {
              router.push("/login");
              return;
            }
            setError("Não foi possível salvar. Tente de novo.");
          },
        },
      );
      return;
    }

    setPendingCreate({ amount: parseFloat(amount), date, description });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex min-w-[280px] flex-1 basis-[340px] flex-col gap-5 rounded-xl border border-line bg-surface p-6"
        style={{ maxWidth: 400 }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold text-ink">
            {editingTransaction ? "Editar transação" : "Nova transação"}
          </span>
          {editingTransaction && (
            <button
              type="button"
              onClick={onDoneEditing}
              className="text-sm text-ink-soft hover:text-ink"
            >
              Cancelar
            </button>
          )}
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-ink-soft">Valor</span>
          <div className="flex items-baseline gap-2 rounded-lg border border-line-strong bg-paper px-4 py-3.5">
            <span className="font-mono text-base text-ink-soft">R$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="min-w-0 flex-1 bg-transparent font-mono text-2xl font-semibold text-ink outline-none"
            />
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-ink-soft">Descrição</span>
          <input
            type="text"
            required
            placeholder="Ex: almoço, uber, netflix"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
          />
        </label>

        {editingTransaction && (
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-medium text-ink-soft">Categoria</span>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => {
                const selected = category === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setCategory(c.value)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      selected
                        ? `${c.soft} ${c.text} border-transparent`
                        : "border-line-strong text-ink-soft hover:border-ink-soft"
                    }`}
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full ${c.dot}`} aria-hidden />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-ink-soft">Data</span>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
          />
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={updateTransaction.isPending}
          className="rounded-lg bg-accent px-4 py-3 text-sm font-bold text-accent-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-45"
        >
          {updateTransaction.isPending
            ? "Salvando..."
            : editingTransaction
              ? "Salvar alterações"
              : "Adicionar transação"}
        </button>
      </form>

      {pendingCreate && (
        <CategorySuggestionModal
          amount={pendingCreate.amount}
          date={pendingCreate.date}
          description={pendingCreate.description}
          onClose={() => setPendingCreate(null)}
          onCreated={() => {
            setPendingCreate(null);
            setAmount(emptyForm.amount);
            setDate(emptyForm.date);
            setDescription(emptyForm.description);
            setCategory(emptyForm.category);
          }}
        />
      )}
    </>
  );
}
