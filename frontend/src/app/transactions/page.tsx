import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CreateTransactionForm } from "./create-transaction-form";
import { LogoutButton } from "./logout-button";
import { TransactionsList } from "./transactions-list";

async function apiFetch(path: string, cookieHeader: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    cache: "no-store",
    headers: { Cookie: cookieHeader },
  });
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

  const user = await getCurrentUser(cookieHeader);
  if (!user) redirect("/login");

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-14 sm:px-10">
      <header className="mb-12 flex items-baseline justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            FinTrack
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {user.email} · <LogoutButton />
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[320px_1fr]">
        <section>
          <h2 className="mb-5 text-sm font-medium text-ink-soft">Nova transação</h2>
          <CreateTransactionForm />
        </section>

        <section>
          <h2 className="mb-5 text-sm font-medium text-ink-soft">Transações recentes</h2>
          <TransactionsList />
        </section>
      </div>
    </main>
  );
}
