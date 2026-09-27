"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, type Category } from "./categories";
import { UnauthorizedError, useCreateTransaction } from "./use-transactions";

export function CreateTransactionForm() {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("food");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const createTransaction = useCreateTransaction();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    createTransaction.mutate(
      { amount: parseFloat(amount), date, description, category },
      {
        onSuccess: () => {
          setAmount("");
          setDate("");
          setDescription("");
          setCategory("food");
        },
        onError: (err) => {
          if (err instanceof UnauthorizedError) {
            router.push("/login");
            return;
          }
          setError("Não foi possível salvar. Tente de novo.");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="amount" className="mb-1.5 block text-sm text-ink-soft">
          Valor
        </label>
        <div className="flex items-center rounded-md border border-line bg-surface px-3 focus-within:border-accent">
          <span className="font-mono text-sm text-ink-soft">R$</span>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent px-2 py-2.5 font-mono text-ink outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm text-ink-soft">
          Descrição
        </label>
        <input
          id="description"
          type="text"
          required
          placeholder="Ex: almoço, uber, netflix"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-line bg-surface px-3 py-2.5 text-ink outline-none focus:border-accent"
        />
      </div>

      <div>
        <span className="mb-1.5 block text-sm text-ink-soft">Categoria</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const selected = category === c.value;
            return (
              <button
                key={c.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setCategory(c.value)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  selected
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-line text-ink-soft hover:border-accent"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${c.dot}`} aria-hidden />
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="date" className="mb-1.5 block text-sm text-ink-soft">
          Data
        </label>
        <input
          id="date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border border-line bg-surface px-3 py-2.5 text-ink outline-none focus:border-accent"
        />
      </div>

      {error && (
        <p className="text-sm text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={createTransaction.isPending}
        className="w-full rounded-md bg-accent px-4 py-2.5 font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {createTransaction.isPending ? "Adicionando..." : "Adicionar transação"}
      </button>
    </form>
  );
}
