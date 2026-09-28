"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";
const API_URL = "/api";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/auth/${mode}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "Não foi possível continuar. Tente de novo.");
        return;
      }

      router.push("/transactions");
      router.refresh();
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
  }

  return (
    <main className="flex min-h-screen flex-wrap">
      <div className="relative hidden min-h-[320px] flex-[1.3_1_420px] md:block">
        <Image
          src="/login-hero.png"
          alt=""
          fill
          priority
          className="object-cover object-[78%_center]"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, transparent 92%, var(--paper) 100%)" }}
        />
      </div>

      <div className="flex flex-1 basis-[400px] items-center justify-center px-6 py-12">
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-7">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-bold tracking-tight text-ink">
              {mode === "login" ? "Entre na sua conta" : "Crie sua conta"}
            </h1>
            <p className="text-sm text-ink-soft">
              Registre seus gastos e receba análises da IA sobre suas finanças.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-medium text-ink-soft">E-mail</span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-line-strong bg-surface px-3.5 py-3 text-sm text-ink outline-none focus:border-accent"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-medium text-ink-soft">Senha</span>
              <div className="relative flex">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-line-strong bg-surface py-3 pr-11 pl-3.5 text-sm text-ink outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute top-1/2 right-1 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-ink-soft transition-colors hover:text-ink"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </label>

            {error && (
              <p className="rounded-lg bg-danger/15 px-3 py-2.5 text-[13px] text-danger">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-gradient-to-r from-[#3b5bff] to-[#7c4dff] py-3.5 text-sm font-bold text-white transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>

          <p className="text-center text-[13px] text-ink-soft">
            {mode === "login" ? (
              <>
                Não tem conta?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="font-semibold text-accent hover:text-accent-hover"
                >
                  Criar uma
                </button>
              </>
            ) : (
              <>
                Já tem conta?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-semibold text-accent hover:text-accent-hover"
                >
                  Entrar
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </main>
  );
}
