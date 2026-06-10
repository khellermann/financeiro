"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { initialTransactionForm, type Category, type OwnerType, type TransactionForm, type TransactionType } from "@/lib/finance";
import { cn } from "@/lib/utils";
import { ArrowDownCircle, ArrowUpCircle, Building2, CirclePlus, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

type TransactionFormCardProps = {
  categories: Category[];
  onSubmit: (form: TransactionForm) => Promise<boolean>;
};

export function TransactionFormCard({ categories, onSubmit }: TransactionFormCardProps) {
  const [form, setForm] = useState<TransactionForm>(initialTransactionForm);
  const [saving, setSaving] = useState(false);
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => category.type === form.type);
  }, [categories, form.type]);
  const selectedCategory = filteredCategories.some((category) => category.name === form.category)
    ? form.category
    : filteredCategories[0]?.name ?? "";

  function changeType(type: TransactionType) {
    const nextCategory = categories.find((category) => category.type === type)?.name ?? "";
    setForm((current) => ({ ...current, type, category: nextCategory }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const created = await onSubmit({ ...form, category: selectedCategory });
    if (created) {
      setForm(initialTransactionForm);
    }
    setSaving(false);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-5">
          <div className="space-y-2">
            <Label>Tipo de lancamento</Label>
            <div className="grid grid-cols-2 gap-2">
              <TypeButton
                active={form.type === "expense"}
                icon={ArrowDownCircle}
                label="Despesa"
                tone="expense"
                onClick={() => changeType("expense")}
              />
              <TypeButton
                active={form.type === "income"}
                icon={ArrowUpCircle}
                label="Receita"
                tone="income"
                onClick={() => changeType("income")}
              />
            </div>
          </div>

          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Label>Natureza do lancamento</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Deixe como juridica para contas da empresa. Marque fisica quando for gasto ou receita pessoal.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <OwnerButton
                active={form.owner_type === "business"}
                icon={Building2}
                label="Pessoa juridica"
                onClick={() => setForm((current) => ({ ...current, owner_type: "business" }))}
                tone="business"
              />
              <OwnerButton
                active={form.owner_type === "personal"}
                icon={UserRound}
                label="Pessoa fisica"
                onClick={() => setForm((current) => ({ ...current, owner_type: "personal" }))}
                tone="personal"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descricao</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              id="category"
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              value={selectedCategory}
              required
            >
              {filteredCategories.length === 0 ? <option value="">Cadastre uma categoria primeiro</option> : null}
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Select>
            <p className="text-xs text-muted-foreground">
              Gerencie categorias na pagina <a className="font-medium text-primary underline-offset-4 hover:underline" href="/categories">Categorias</a>.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                inputMode="decimal"
                placeholder="0,00"
                value={form.amount}
                onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction_date">Data</Label>
              <Input
                id="transaction_date"
                type="date"
                value={form.transaction_date}
                onChange={(event) => setForm((current) => ({ ...current, transaction_date: event.target.value }))}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
          <Button variant="outline" asChild>
            <a href="/dashboard">
              Cancelar
            </a>
          </Button>
          <Button type="submit" disabled={saving}>
            <CirclePlus className="size-4" aria-hidden="true" />
            {saving ? "Salvando..." : "Adicionar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function OwnerButton({
  active,
  icon: Icon,
  label,
  onClick,
  tone
}: {
  active: boolean;
  icon: typeof Building2;
  label: string;
  onClick: () => void;
  tone: OwnerType;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "flex h-10 items-center justify-center gap-2 rounded-md border border-transparent px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        active &&
          (tone === "business"
            ? "border-sky-200 bg-sky-50 text-sky-700 shadow-sm"
            : "border-violet-200 bg-violet-50 text-violet-700 shadow-sm")
      )}
      onClick={onClick}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function TypeButton({
  active,
  icon: Icon,
  label,
  onClick,
  tone
}: {
  active: boolean;
  icon: typeof ArrowDownCircle;
  label: string;
  onClick: () => void;
  tone: TransactionType;
}) {
  const isIncome = tone === "income";

  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "flex h-10 items-center justify-center gap-2 rounded-md border border-transparent px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isIncome
          ? "text-emerald-700 hover:bg-emerald-50"
          : "text-rose-700 hover:bg-rose-50",
        active &&
          (isIncome
            ? "border-emerald-200 bg-emerald-50 shadow-sm"
            : "border-rose-200 bg-rose-50 shadow-sm")
      )}
      onClick={onClick}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}
