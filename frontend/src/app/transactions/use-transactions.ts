"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category } from "./categories";
import type { Insight, Transaction } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/transactions`, {
        credentials: "include",
      });
      if (res.status === 401) throw new UnauthorizedError();
      if (!res.ok) throw new Error("Falha ao carregar transações.");
      return res.json();
    },
  });
}

export type NewTransaction = {
  amount: number;
  date: string;
  description: string;
  category: Category;
};

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation<Transaction, Error, NewTransaction>({
    mutationFn: async (data) => {
      const res = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 401) throw new UnauthorizedError();
      if (!res.ok) throw new Error("Falha ao criar transação.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation<Transaction, Error, { id: string; data: NewTransaction }>({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 401) throw new UnauthorizedError();
      if (!res.ok) throw new Error("Falha ao atualizar transação.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useSuggestCategory() {
  return useMutation<Category, Error, string>({
    mutationFn: async (description) => {
      const res = await fetch(`${API_URL}/transactions/suggest-category`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (res.status === 401) throw new UnauthorizedError();
      if (!res.ok) throw new Error("Falha ao sugerir categoria.");
      const data: { category: Category } = await res.json();
      return data.category;
    },
  });
}

export function useGenerateInsights() {
  return useMutation<Insight[], Error, void>({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/transactions/insights`, {
        method: "POST",
        credentials: "include",
      });
      if (res.status === 401) throw new UnauthorizedError();
      if (!res.ok) throw new Error("Falha ao gerar análise.");
      return res.json();
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401) throw new UnauthorizedError();
      if (!res.ok) throw new Error("Falha ao excluir transação.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
