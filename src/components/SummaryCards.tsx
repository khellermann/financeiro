import { currencyFormatter } from "@/lib/finance";
import { cn } from "@/lib/utils";
import { ArrowDownCircle, ArrowUpCircle, Landmark } from "lucide-react";

type SummaryCardsProps = {
  expense: number;
  income: number;
};

export function SummaryCards({ expense, income }: SummaryCardsProps) {
  const balance = income - expense;
  const items = [
    {
      label: "Receitas",
      value: income,
      icon: ArrowUpCircle,
      className: "border-emerald-200 bg-emerald-50 text-emerald-700"
    },
    {
      label: "Despesas",
      value: expense,
      icon: ArrowDownCircle,
      className: "border-rose-200 bg-rose-50 text-rose-700"
    },
    {
      label: "Saldo",
      value: balance,
      icon: Landmark,
      className: balance >= 0 ? "border-cyan-200 bg-cyan-50 text-cyan-700" : "border-amber-200 bg-amber-50 text-amber-700"
    }
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <section className={cn("rounded-lg border p-4 shadow-sm", item.className)} key={item.label}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-normal opacity-80">{item.label}</p>
              <Icon className="size-5 opacity-80" aria-hidden="true" />
            </div>
            <div className="text-2xl font-bold tracking-normal md:text-3xl">{currencyFormatter.format(item.value)}</div>
          </section>
        );
      })}
    </div>
  );
}
