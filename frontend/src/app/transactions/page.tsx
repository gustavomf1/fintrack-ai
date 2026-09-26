import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CreateTransactionForm } from "./create-transaction-form";
import { LogoutButton } from "./logout-button";
import { categoryDot, categoryLabel } from "./categories";

type Transaction = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

async function apiFetch(path: string, cookieHeader: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    cache: "no-store",
    headers: { Cookie: cookieHeader },
  });
}

async function getTransactions(
  cookieHeader: string,
): Promise<{ data: Transaction[]; error: boolean }> {
  try {
    const res = await apiFetch("/transactions", cookieHeader);
    if (res.status === 401) redirect("/login");
    if (!res.ok) return { data: [], error: true };
    return { data: await res.json(), error: false };
  } catch {
    return { data: [], error: true };
  }
}

async function getCurrentUser(cookieHeader: string): Promise<{ email: string } | null> {
  try {
    const res = await apiFetch("/auth/me", cookieHeader);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function TransactionsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const [{ data: transactions, error }, user] = await Promise.all([
    getTransactions(cookieHeader),
    getCurrentUser(cookieHeader),
  ]);
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-14 sm:px-10">
      <header className="mb-12 flex items-baseline justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            FinTrack
          </h1>
          {user && (
            <p className="mt-1 text-sm text-ink-soft">
              {user.email} · <LogoutButton />
            </p>
          )}
        </div>
        {!error && (
          <div className="text-right">
            <p className="font-mono text-2xl font-medium tabular-nums text-ink">
              {currency.format(total)}
            </p>
            <p className="text-sm text-ink-soft">
              {transactions.length === 1
                ? "1 transação"
                : `${transactions.length} transações`}
            </p>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[320px_1fr]">
        <section>
          <h2 className="mb-5 text-sm font-medium text-ink-soft">Nova transação</h2>
          <CreateTransactionForm />
        </section>

        <section>
          <h2 className="mb-5 text-sm font-medium text-ink-soft">Transações recentes</h2>

          {error && (
            <p className="rounded-md border border-line bg-surface px-5 py-4 text-sm text-ink-soft">
              Não foi possível carregar as transações. Confira se o backend está no ar.
            </p>
          )}

          {!error && transactions.length === 0 && (
            <p className="rounded-md border border-dashed border-line px-5 py-8 text-center text-sm text-ink-soft">
              Nenhuma transação ainda. Adicione a primeira ao lado.
            </p>
          )}

          {!error && transactions.length > 0 && (
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
          )}
        </section>
      </div>
    </main>
  );
}
