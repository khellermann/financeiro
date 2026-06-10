"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";

export type TransactionType = "income" | "expense";
export type OwnerType = "business" | "personal";

export type Transaction = {
  id: string;
  type: TransactionType;
  owner_type: OwnerType;
  description: string;
  category: string;
  amount: number;
  transaction_date: string;
};

export type Category = {
  id: string;
  icon: string;
  type: TransactionType;
  name: string;
};

export type TransactionForm = {
  type: TransactionType;
  owner_type: OwnerType;
  description: string;
  category: string;
  amount: string;
  transaction_date: string;
};

export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export const initialTransactionForm: TransactionForm = {
  type: "expense",
  owner_type: "business",
  description: "",
  category: "",
  amount: "",
  transaction_date: today()
};

const demoCategories: Category[] = [
  { id: "category-expense-1", icon: "home", type: "expense", name: "Moradia" },
  { id: "category-expense-2", icon: "basket", type: "expense", name: "Alimentacao" },
  { id: "category-expense-3", icon: "bus", type: "expense", name: "Transporte" },
  { id: "category-expense-4", icon: "health", type: "expense", name: "Saude" },
  { id: "category-income-1", icon: "salary", type: "income", name: "Salario" },
  { id: "category-income-2", icon: "freelance", type: "income", name: "Freelance" },
  { id: "category-income-3", icon: "investment", type: "income", name: "Investimentos" }
];

const demoTransactions: Transaction[] = [
  {
    id: "demo-1",
    type: "income",
    owner_type: "business",
    description: "Salario",
    category: "Salario",
    amount: 5200,
    transaction_date: today()
  },
  {
    id: "demo-2",
    type: "expense",
    owner_type: "business",
    description: "Aluguel",
    category: "Moradia",
    amount: 1450,
    transaction_date: today()
  },
  {
    id: "demo-3",
    type: "expense",
    owner_type: "personal",
    description: "Supermercado",
    category: "Alimentacao",
    amount: 386.75,
    transaction_date: today()
  }
];

const previewStorageKey = "finance-control-preview-transactions";
const previewCategoriesStorageKey = "finance-control-preview-categories";

function getPreviewTransactions() {
  const stored = window.localStorage.getItem(previewStorageKey);
  if (!stored) {
    window.localStorage.setItem(previewStorageKey, JSON.stringify(demoTransactions));
    return demoTransactions;
  }

  try {
    return (JSON.parse(stored) as Transaction[]).map((transaction) => ({
      ...transaction,
      owner_type: transaction.owner_type ?? "business"
    }));
  } catch {
    window.localStorage.setItem(previewStorageKey, JSON.stringify(demoTransactions));
    return demoTransactions;
  }
}

function setPreviewTransactions(transactions: Transaction[]) {
  window.localStorage.setItem(previewStorageKey, JSON.stringify(transactions));
}

function getPreviewCategories() {
  const stored = window.localStorage.getItem(previewCategoriesStorageKey);
  if (!stored) {
    window.localStorage.setItem(previewCategoriesStorageKey, JSON.stringify(demoCategories));
    return demoCategories;
  }

  try {
    return (JSON.parse(stored) as Category[]).map((category) => ({ ...category, icon: category.icon ?? "tag" }));
  } catch {
    window.localStorage.setItem(previewCategoriesStorageKey, JSON.stringify(demoCategories));
    return demoCategories;
  }
}

function setPreviewCategories(categories: Category[]) {
  window.localStorage.setItem(previewCategoriesStorageKey, JSON.stringify(categories));
}

export function useFinance() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const previewMode = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "preview-key";
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from("transactions")
      .select("id,type,owner_type,description,category,amount,transaction_date")
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (loadError) {
      setError(loadError.message);
      return;
    }

    setTransactions((data ?? []) as Transaction[]);
  }, [supabase]);

  const loadCategories = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from("categories")
      .select("id,type,name,icon")
      .order("type", { ascending: true })
      .order("name", { ascending: true });

    if (loadError) {
      setError(loadError.message);
      return;
    }

    setCategories((data ?? []) as Category[]);
  }, [supabase]);

  useEffect(() => {
    async function loadSession() {
      if (previewMode) {
        setUser({ id: "preview-user", email: "demo@controle.local" } as User);
        setCategories(getPreviewCategories());
        setTransactions(getPreviewTransactions());
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        window.location.href = "/login";
        return;
      }

      setUser(data.session.user);
      await loadCategories();
      await loadTransactions();
      setLoading(false);
    }

    loadSession();
  }, [loadCategories, loadTransactions, previewMode, supabase]);

  async function createCategory(type: TransactionType, name: string, icon = "tag") {
    if (!user) return null;

    const normalizedName = name.trim();
    if (!normalizedName) {
      setError("Informe o nome da categoria.");
      return null;
    }

    setError(null);

    if (previewMode) {
      const currentCategories = getPreviewCategories();
      const existing = currentCategories.find(
        (category) => category.type === type && category.name.toLowerCase() === normalizedName.toLowerCase()
      );

      if (existing) {
        return existing;
      }

      const category = {
        id: crypto.randomUUID(),
        icon,
        type,
        name: normalizedName
      };
      const nextCategories = [...currentCategories, category].sort((first, second) => first.name.localeCompare(second.name));
      setPreviewCategories(nextCategories);
      setCategories(nextCategories);
      return category;
    }

    const { data, error: insertError } = await supabase
      .from("categories")
      .insert({
        user_id: user.id,
        icon,
        type,
        name: normalizedName
      })
      .select("id,type,name,icon")
      .single();

    if (insertError) {
      setError(insertError.message);
      return null;
    }

    await loadCategories();
    return data as Category;
  }

  async function createTransaction(form: TransactionForm) {
    if (!user) return false;

    setError(null);
    const normalizedAmount = Number(form.amount.replace(",", "."));

    if (!normalizedAmount || normalizedAmount <= 0) {
      setError("Informe um valor maior que zero.");
      return false;
    }

    if (!form.category.trim()) {
      setError("Selecione uma categoria.");
      return false;
    }

    const transaction = {
      type: form.type,
      owner_type: form.owner_type,
      description: form.description.trim(),
      category: form.category.trim(),
      amount: normalizedAmount,
      transaction_date: form.transaction_date
    };

    if (previewMode) {
      const nextTransactions = [
        {
          id: crypto.randomUUID(),
          ...transaction
        },
        ...getPreviewTransactions()
      ];
      setPreviewTransactions(nextTransactions);
      setTransactions(nextTransactions);
      return true;
    }

    const { error: insertError } = await supabase.from("transactions").insert({
      user_id: user.id,
      ...transaction
    });

    if (insertError) {
      setError(insertError.message);
      return false;
    }

    await loadTransactions();
    return true;
  }

  async function updateCategory(category: Category, name: string, icon = category.icon) {
    if (!user) return null;

    const normalizedName = name.trim();
    if (!normalizedName) {
      setError("Informe o nome da categoria.");
      return null;
    }

    setError(null);

    if (previewMode) {
      const nextCategories = getPreviewCategories()
        .map((currentCategory) =>
          currentCategory.id === category.id ? { ...currentCategory, icon, name: normalizedName } : currentCategory
        )
        .sort((first, second) => first.name.localeCompare(second.name));
      const nextTransactions = getPreviewTransactions().map((transaction) =>
        transaction.type === category.type && transaction.category === category.name
          ? { ...transaction, category: normalizedName }
          : transaction
      );

      setPreviewCategories(nextCategories);
      setPreviewTransactions(nextTransactions);
      setCategories(nextCategories);
      setTransactions(nextTransactions);
      return nextCategories.find((currentCategory) => currentCategory.id === category.id) ?? null;
    }

    const { data, error: updateError } = await supabase
      .from("categories")
      .update({ icon, name: normalizedName })
      .eq("id", category.id)
      .select("id,type,name,icon")
      .single();

    if (updateError) {
      setError(updateError.message);
      return null;
    }

    const { error: transactionUpdateError } = await supabase
      .from("transactions")
      .update({ category: normalizedName })
      .eq("type", category.type)
      .eq("category", category.name);

    if (transactionUpdateError) {
      setError(transactionUpdateError.message);
      return null;
    }

    await loadCategories();
    await loadTransactions();
    return data as Category;
  }

  async function deleteCategory(id: string) {
    setError(null);

    if (previewMode) {
      const nextCategories = getPreviewCategories().filter((category) => category.id !== id);
      setPreviewCategories(nextCategories);
      setCategories(nextCategories);
      return true;
    }

    const { error: deleteError } = await supabase.from("categories").delete().eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return false;
    }

    setCategories((current) => current.filter((category) => category.id !== id));
    return true;
  }

  async function deleteTransaction(id: string) {
    setError(null);

    if (previewMode) {
      const nextTransactions = getPreviewTransactions().filter((transaction) => transaction.id !== id);
      setPreviewTransactions(nextTransactions);
      setTransactions(nextTransactions);
      return;
    }

    const { error: deleteError } = await supabase.from("transactions").delete().eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setTransactions((current) => current.filter((transaction) => transaction.id !== id));
  }

  async function signOut() {
    if (!previewMode) {
      await supabase.auth.signOut();
    }

    window.location.href = "/login";
  }

  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") acc.income += Number(transaction.amount);
      if (transaction.type === "expense") acc.expense += Number(transaction.amount);
      return acc;
    },
    { income: 0, expense: 0 }
  );

  return {
    categories,
    createCategory,
    createTransaction,
    deleteCategory,
    deleteTransaction,
    error,
    loading,
    signOut,
    totals,
    transactions,
    updateCategory,
    user
  };
}
