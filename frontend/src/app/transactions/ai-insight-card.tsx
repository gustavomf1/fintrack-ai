"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UnauthorizedError, useGenerateInsights, useTransactions } from "./use-transactions";

export function AiInsightCard() {
  const { data: transactions } = useTransactions();
  const router = useRouter();
  const insights = useGenerateInsights();

  useEffect(() => {
    if (insights.error instanceof UnauthorizedError) router.push("/login");
  }, [insights.error, router]);

  const buttonLabel = insights.isPending
    ? "Analisando…"
    : insights.isSuccess
      ? "Atualizar análise"
      : "Gerar análise";

  return (
    <section className="flex flex-col gap-3.5 rounded-xl border border-line bg-surface px-6 py-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-cat-subscription/15 text-cat-subscription">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
              <path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z" />
            </svg>
          </div>
          <span className="text-[15px] font-bold text-ink">Análise da IA</span>
        </div>
        <button
          type="button"
          onClick={() => insights.mutate()}
          disabled={insights.isPending || !transactions}
          className="rounded-lg border border-line-strong bg-muted px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {buttonLabel}
        </button>
      </div>

      {insights.isIdle && (
        <p className="text-sm text-ink-soft">
          Registre suas transações e gere uma análise de como estão seus gastos no mês.
        </p>
      )}

      {insights.isPending && (
        <div className="flex flex-col gap-2">
          <div className="h-2.5 w-[92%] animate-pulse rounded-md bg-muted" />
          <div className="h-2.5 w-[78%] animate-pulse rounded-md bg-muted" />
          <div className="h-2.5 w-[60%] animate-pulse rounded-md bg-muted" />
        </div>
      )}

      {insights.isError && !(insights.error instanceof UnauthorizedError) && (
        <p className="text-sm text-danger">Não foi possível gerar a análise. Tente de novo.</p>
      )}

      {insights.isSuccess && (
        <ul className="flex flex-col gap-2.5">
          {insights.data.map((insight, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink">
              <span
                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${insight.severity === "warning" ? "bg-danger" : "bg-accent"}`}
                aria-hidden
              />
              <span>{insight.message}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
