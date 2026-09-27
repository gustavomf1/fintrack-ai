"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-line-strong px-3 py-1.5 text-sm text-ink-soft transition-colors hover:bg-muted"
    >
      Sair
    </button>
  );
}
