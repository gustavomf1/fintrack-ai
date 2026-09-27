"use client";

import { useState } from "react";
import { categoryLabel, categoryTextClass } from "./categories";
import { useTransactions } from "./use-transactions";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type InsightState = "idle" | "loading" | "done";

type Insight = {
  colorClass: string;
  text: string;
};

function buildInsights(transactions: { amount: number; category: string; description: string; date: string }[]): Insight[] {
  if (transactions.length === 0) {
    return [{ colorClass: "text-ink-soft", text: "Sem transações para analisar." }];
  }

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalsByCategory = new Map<string, number>();
  transactions.forEach((t) => {
    totalsByCategory.set(t.category, (totalsByCategory.get(t.category) ?? 0) + t.amount);
  });

  const [topCategory, topAmount] = [...totalsByCategory.entries()].sort((a, b) => b[1] - a[1])[0];
  const biggest = [...transactions].sort((a, b) => b.amount - a.amount)[0];
  const pct = Math.round((topAmount / total) * 100);

  const insights: Insight[] = [
    {
      colorClass: categoryTextClass(topCategory),
      text: `${categoryLabel(topCategory)} concentra ${pct}% dos seus gastos (${currency.format(topAmount)}).`,
    },
    {
      colorClass: categoryTextClass(biggest.category),
      text: `Maior gasto individual: "${biggest.description}", ${currency.format(biggest.amount)} em ${new Date(biggest.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}.`,
    },
  ];

  const foodTotal = totalsByCategory.get("food");
  if (foodTotal) {
    insights.push({
      colorClass: categoryTextClass("food"),
      text: `Alimentação soma ${currency.format(foodTotal)}. Planejar as refeições da semana tende a reduzir esse valor.`,
    });
  }

  return insights;
}

export function AiInsightCard() {
  const { data: transactions } = useTransactions();
  const [state, setState] = useState<InsightState>("idle");

  function handleRun() {
    setState("loading");
    setTimeout(() => setState("done"), 1200);
  }

  const buttonLabel =
    state === "idle" ? "Gerar análise" : state === "loading" ? "Analisando…" : "Atualizar análise";

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
          onClick={handleRun}
          disabled={state === "loading"}
          className="rounded-lg border border-line-strong bg-muted px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {buttonLabel}
        </button>
      </div>

      {state === "idle" && (
        <p className="text-sm text-ink-soft">
          Registre suas transações e gere uma análise de como estão seus gastos no mês.
        </p>
      )}

      {state === "loading" && (
        <div className="flex flex-col gap-2">
          <div className="h-2.5 w-[92%] animate-pulse rounded-md bg-muted" />
          <div className="h-2.5 w-[78%] animate-pulse rounded-md bg-muted" />
          <div className="h-2.5 w-[60%] animate-pulse rounded-md bg-muted" />
        </div>
      )}

      {state === "done" && transactions && (
        <ul className="flex flex-col gap-2.5">
          {buildInsights(transactions).map((insight, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink">
              <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${insight.colorClass} bg-current`} aria-hidden />
              <span>{insight.text}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
