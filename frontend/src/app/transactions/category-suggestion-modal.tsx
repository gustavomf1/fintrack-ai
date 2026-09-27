"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, type Category } from "./categories";
import { UnauthorizedError, useCreateTransaction, useSuggestCategory } from "./use-transactions";

export function CategorySuggestionModal({
  amount,
  date,
  description,
  onClose,
  onCreated,
}: {
  amount: number;
  date: string;
  description: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [selected, setSelected] = useState<Category | null>(null);
  const [suggestionFailed, setSuggestionFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const suggestCategory = useSuggestCategory();
  const createTransaction = useCreateTransaction();

  useEffect(() => {
    suggestCategory.mutate(description, {
      onSuccess: (category) => setSelected(category),
      onError: (err) => {
        if (err instanceof UnauthorizedError) {
          router.push("/login");
          return;
        }
        setSuggestionFailed(true);
        setSelected("other");
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleConfirm() {
    if (!selected) return;
    setError(null);

    createTransaction.mutate(
      { amount, date, description, category: selected },
      {
        onSuccess: onCreated,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-6">
        <p className="text-[15px] font-bold text-ink">Sugestão de categoria</p>
        {suggestionFailed ? (
          <p className="mt-1 mb-4 text-sm text-danger">
            Não foi possível sugerir automaticamente — escolha a categoria manualmente.
          </p>
        ) : (
          <p className="mt-1 mb-4 text-sm text-ink-soft">
            Baseado em &quot;{description}&quot;, a IA sugere a categoria abaixo — pode trocar se
            quiser.
          </p>
        )}

        {!selected && (
          <div className="mb-5 h-[124px] animate-pulse rounded-lg bg-muted" />
        )}

        {selected && (
          <div className="mb-5 grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => {
              const isSelected = selected === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelected(c.value)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    isSelected
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
        )}

        {error && <p className="mb-4 text-sm text-danger">{error}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-line-strong px-4 py-2.5 text-sm text-ink-soft transition-colors hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selected || createTransaction.isPending}
            className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-accent-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createTransaction.isPending ? "Salvando..." : "Cadastrar transação"}
          </button>
        </div>
      </div>
    </div>
  );
}
