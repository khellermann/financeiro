"use client";

import { AppShell } from "@/components/AppShell";
import { LoadingScreen } from "@/components/LoadingScreen";
import { TransactionFormCard } from "@/components/TransactionFormCard";
import { useFinance } from "@/lib/finance";
import { useRouter } from "next/navigation";

export default function NewTransactionPage() {
  const router = useRouter();
  const { categories, createTransaction, error, loading, signOut, user } = useFinance();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AppShell onSignOut={signOut} title="Novo lancamento" user={user}>
      {error ? <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

      <div className="max-w-2xl">
        <TransactionFormCard
          categories={categories}
          onSubmit={async (form) => {
            const created = await createTransaction(form);
            if (created) {
              router.push("/transactions");
            }
            return created;
          }}
        />
      </div>
    </AppShell>
  );
}
