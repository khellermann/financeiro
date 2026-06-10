"use client";

import { AppShell } from "@/components/AppShell";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionTable } from "@/components/TransactionTable";
import { Card, CardContent } from "@/components/ui/card";
import { useFinance } from "@/lib/finance";
import { CirclePlus, ListChecks, Tags, type LucideIcon } from "lucide-react";

export default function DashboardPage() {
  const { categories, error, loading, signOut, totals, transactions, user } = useFinance();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AppShell onSignOut={signOut} title="Dashboard" user={user}>
      {error ? <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

      <SummaryCards expense={totals.expense} income={totals.income} />

      <div className="my-4 grid gap-3 md:grid-cols-3">
        <DashboardAction href="/transactions/new" icon={CirclePlus} label="Novo lancamento" text="Cadastrar receita ou despesa" />
        <DashboardAction href="/transactions" icon={ListChecks} label="Lancamentos" text="Ver historico completo" />
        <DashboardAction href="/categories" icon={Tags} label="Categorias" text="Organizar por receita e despesa" />
      </div>

      <TransactionTable categories={categories} transactions={transactions.slice(0, 5)} />
    </AppShell>
  );
}

function DashboardAction({
  href,
  icon: Icon,
  label,
  text
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  text: string;
}) {
  return (
    <Card className="transition-colors hover:bg-accent">
      <a href={href}>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Icon className="size-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold">{label}</h2>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        </CardContent>
      </a>
    </Card>
  );
}
