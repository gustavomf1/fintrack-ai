import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogoutButton } from "./logout-button";
import { TransactionsWorkspace } from "./transactions-workspace";
const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/$/, "") || "http://localhost:3000";


async function apiFetch(path: string, cookieHeader: string) {
  return fetch(`${BACKEND_URL}${path}`, {
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
    <div className="min-h-full">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Image src="/icon.png" alt="FinTrack" width={30} height={30} className="rounded-lg" />
            <span className="text-[17px] font-bold tracking-tight text-ink">FinTrack</span>
          </div>
          <div className="flex items-center gap-3.5 text-sm text-ink-soft">
            <span>{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 pb-16">
        <TransactionsWorkspace />
      </main>
    </div>
  );
}
