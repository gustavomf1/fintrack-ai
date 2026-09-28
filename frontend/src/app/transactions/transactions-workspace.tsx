"use client";

import { useState } from "react";
import { AiInsightCard } from "./ai-insight-card";
import { CreateTransactionForm } from "./create-transaction-form";
import { SummaryBar } from "./summary-bar";
import { TransactionsList } from "./transactions-list";
import type { Transaction } from "./types";

export function TransactionsWorkspace() {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <SummaryBar />

      <div className="flex flex-wrap items-start gap-6">
        <CreateTransactionForm
          key={editingTransaction?.id ?? "create"}
          editingTransaction={editingTransaction}
          onDoneEditing={() => setEditingTransaction(null)}
        />

        <div className="flex min-w-0 flex-1 basis-[480px] flex-col gap-6">
          <AiInsightCard />
          <TransactionsList
            editingId={editingTransaction?.id ?? null}
            onEdit={setEditingTransaction}
          />
        </div>
      </div>
    </div>
  );
}
