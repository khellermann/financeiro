"use client";

import { AppShell } from "@/components/AppShell";
import { LoadingScreen } from "@/components/LoadingScreen";
import { TransactionTable } from "@/components/TransactionTable";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/lib/finance";
import { CirclePlus } from "lucide-react";

export default function TransactionsPage() {
  const { categories, deleteTransaction, error, loading, signOut, transactions, user } = useFinance();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AppShell onSignOut={signOut} title="Lancamentos" user={user}>
      {error ? <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

      <div className="mb-4 flex justify-end">
        <Button asChild>
          <a href="/transactions/new">
            <CirclePlus className="size-4" aria-hidden="true" />
            Novo lancamento
          </a>
        </Button>
      </div>

      <TransactionTable categories={categories} onDelete={deleteTransaction} transactions={transactions} />
    </AppShell>
  );
}
