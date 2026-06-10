"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";
import { BarChart3, CirclePlus, LayoutDashboard, ListChecks, LogOut, Tags, WalletCards } from "lucide-react";
import { usePathname } from "next/navigation";

type AppShellProps = {
  children: React.ReactNode;
  onSignOut: () => void;
  title: string;
  user: User | null;
};

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", shortLabel: "Inicio" },
  { href: "/transactions/new", icon: CirclePlus, label: "Novo lancamento", shortLabel: "Novo" },
  { href: "/transactions", icon: ListChecks, label: "Lancamentos", shortLabel: "Lista" }
];

const desktopNavItems = [...navItems, { href: "/categories", icon: Tags, label: "Categorias", shortLabel: "Categorias" }];

export function AppShell({ children, onSignOut, title, user }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <a className="flex min-w-0 items-center gap-2 font-semibold" href="/dashboard">
            <WalletCards className="size-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">Controle Financeiro</span>
          </a>

          <Button variant="outline" size="sm" type="button" onClick={onSignOut}>
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </Button>
        </div>
      </header>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r bg-card md:flex md:flex-col">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <WalletCards className="size-5" aria-hidden="true" />
          </div>
          <div>
            <a className="font-semibold leading-none" href="/dashboard">
              Controle Financeiro
            </a>
            <p className="mt-1 text-xs text-muted-foreground">Next + Supabase</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <a
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
                key={item.href}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <div className="mb-3 flex items-center gap-3 rounded-md bg-muted p-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-background text-sm font-semibold text-primary">
              {user?.email?.slice(0, 1).toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Conta conectada</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start" type="button" onClick={onSignOut}>
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </Button>
        </div>
      </aside>

      <main className="md:pl-72">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 md:py-8 lg:px-8">
          <div className="mb-5 flex items-center justify-between gap-4 md:mb-8">
            <div>
              <div className="mb-2 hidden items-center gap-2 text-sm text-muted-foreground md:flex">
                <BarChart3 className="size-4" aria-hidden="true" />
                Financeiro pessoal
              </div>
              <h1 className="text-2xl font-bold tracking-normal md:text-3xl">{title}</h1>
            </div>
          </div>
          {children}
        </div>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t bg-card/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden"
        aria-label="Navegacao principal"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-xs font-semibold text-muted-foreground",
                pathname === item.href && "bg-primary/10 text-primary"
              )}
              key={item.href}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span>{item.shortLabel}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
