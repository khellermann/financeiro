"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryIcon } from "@/lib/category-icons";
import { currencyFormatter, type Category, type OwnerType, type Transaction, type TransactionType } from "@/lib/finance";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type TransactionTableProps = {
  categories?: Category[];
  onDelete?: (id: string) => void;
  transactions: Transaction[];
};

export function TransactionTable({ categories = [], onDelete, transactions }: TransactionTableProps) {
  const [filter, setFilter] = useState<"all" | TransactionType>("all");
  const [ownerFilter, setOwnerFilter] = useState<"all" | OwnerType>("all");
  const visibleTransactions = transactions.filter((transaction) => {
    const matchesType = filter === "all" || transaction.type === filter;
    const matchesOwner = ownerFilter === "all" || transaction.owner_type === ownerFilter;
    return matchesType && matchesOwner;
  });

  return (
    <Card>
      <CardHeader className="gap-4">
        <CardTitle>Lancamentos</CardTitle>
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <SegmentedFilter
            ariaLabel="Filtro de tipo"
            items={[
              { label: "Todos", value: "all" },
              { label: "Receitas", value: "income" },
              { label: "Despesas", value: "expense" }
            ]}
            value={filter}
            onChange={(value) => setFilter(value as "all" | TransactionType)}
          />
          <SegmentedFilter
            ariaLabel="Filtro de natureza"
            items={[
              { label: "Consolidado", value: "all" },
              { label: "Fisica", value: "personal" },
              { label: "Juridica", value: "business" }
            ]}
            value={ownerFilter}
            onChange={(value) => setOwnerFilter(value as "all" | OwnerType)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {visibleTransactions.length === 0 ? (
          <div className="rounded-md border border-dashed py-10 text-center text-sm text-muted-foreground">
            Nenhum lancamento encontrado.
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-md border md:block">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Descricao</th>
                    <th className="px-4 py-3">Categoria</th>
                    <th className="px-4 py-3">Natureza</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3 text-right">Valor</th>
                    {onDelete ? <th className="px-4 py-3 text-right">Acoes</th> : null}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {visibleTransactions.map((transaction) => (
                    <tr className="bg-card" key={transaction.id}>
                      <td className="px-4 py-3">{new Date(`${transaction.transaction_date}T00:00:00`).toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-3 font-medium">{transaction.description}</td>
                      <td className="px-4 py-3">
                        <CategoryLabel categories={categories} transaction={transaction} />
                      </td>
                      <td className="px-4 py-3">
                        <OwnerBadge ownerType={transaction.owner_type} />
                      </td>
                      <td className="px-4 py-3">
                        <TransactionBadge type={transaction.type} />
                      </td>
                      <td className={cn("px-4 py-3 text-right font-semibold", transaction.type === "income" ? "text-emerald-700" : "text-rose-700")}>
                        {currencyFormatter.format(Number(transaction.amount))}
                      </td>
                      {onDelete ? (
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            onClick={() => onDelete(transaction.id)}
                            title="Excluir"
                            aria-label={`Excluir ${transaction.description}`}
                          >
                            <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                          </Button>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {visibleTransactions.map((transaction) => (
                <article className="rounded-lg border bg-background p-4 shadow-sm" key={transaction.id}>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{transaction.description}</h3>
                      <CategoryLabel categories={categories} transaction={transaction} />
                    </div>
                    <TransactionBadge type={transaction.type} />
                  </div>
                  <div className="mb-3">
                    <OwnerBadge ownerType={transaction.owner_type} />
                  </div>

                  <div className="mb-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground">Data</p>
                      <p className="text-sm">{new Date(`${transaction.transaction_date}T00:00:00`).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <p className={cn("text-lg font-bold", transaction.type === "income" ? "text-emerald-700" : "text-rose-700")}>
                      {currencyFormatter.format(Number(transaction.amount))}
                    </p>
                  </div>

                  {onDelete ? (
                    <Button className="w-full" variant="outline" type="button" onClick={() => onDelete(transaction.id)}>
                      <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                      Excluir
                    </Button>
                  ) : null}
                </article>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function SegmentedFilter({
  ariaLabel,
  items,
  onChange,
  value
}: {
  ariaLabel: string;
  items: { label: string; value: string }[];
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="grid grid-cols-3 rounded-md border p-1" role="group" aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          className={cn(
            "rounded-sm px-3 py-2 text-xs font-medium text-muted-foreground transition-colors",
            value === item.value && "bg-primary text-primary-foreground"
          )}
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function TransactionBadge({ type }: { type: TransactionType }) {
  return (
    <Badge
      className={cn(
        "border-transparent",
        type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
      )}
    >
      {type === "income" ? "Receita" : "Despesa"}
    </Badge>
  );
}

function OwnerBadge({ ownerType }: { ownerType?: OwnerType }) {
  const type = ownerType ?? "business";

  return (
    <Badge
      className={cn(
        "border-transparent",
        type === "personal" ? "bg-violet-100 text-violet-700" : "bg-sky-100 text-sky-700"
      )}
    >
      {type === "personal" ? "Pessoa fisica" : "Pessoa juridica"}
    </Badge>
  );
}

function CategoryLabel({ categories, transaction }: { categories: Category[]; transaction: Transaction }) {
  const category = categories.find(
    (currentCategory) => currentCategory.type === transaction.type && currentCategory.name === transaction.category
  );
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <CategoryIcon className="size-4" name={category?.icon} aria-hidden="true" />
      {transaction.category}
    </span>
  );
}
