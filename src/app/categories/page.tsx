"use client";

import { AppShell } from "@/components/AppShell";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CategoryIcon, categoryIcons } from "@/lib/category-icons";
import { useFinance, type Category, type TransactionType } from "@/lib/finance";
import { cn } from "@/lib/utils";
import { Pencil, Plus, Tags, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function CategoriesPage() {
  const { categories, createCategory, deleteCategory, error, loading, signOut, updateCategory, user } = useFinance();
  const [type, setType] = useState<TransactionType>("expense");
  const [icon, setIcon] = useState("tag");
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editIcon, setEditIcon] = useState("tag");
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const groupedCategories = useMemo(() => {
    return {
      expense: categories.filter((category) => category.type === "expense"),
      income: categories.filter((category) => category.type === "income")
    };
  }, [categories]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const category = await createCategory(type, name, icon);
    if (category) {
      setName("");
      setIcon("tag");
      selectCategory(category);
    }
    setSaving(false);
  }

  function selectCategory(category: Category) {
    setSelectedCategory(category);
    setEditIcon(category.icon);
    setEditName(category.name);
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCategory) return;

    setEditing(true);
    const category = await updateCategory(selectedCategory, editName, editIcon);
    if (category) {
      selectCategory(category);
    }
    setEditing(false);
  }

  async function handleDelete() {
    if (!selectedCategory) return;

    setDeleting(true);
    const deleted = await deleteCategory(selectedCategory.id);
    if (deleted) {
      setSelectedCategory(null);
      setEditName("");
    }
    setDeleting(false);
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AppShell onSignOut={signOut} title="Categorias" user={user}>
      {error ? <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,380px)_1fr_minmax(0,380px)]">
        <Card>
          <CardHeader>
            <CardTitle>Nova categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="category-type">Tipo</Label>
                <Select id="category-type" value={type} onChange={(event) => setType(event.target.value as TransactionType)}>
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-name">Nome</Label>
                <Input
                  id="category-name"
                  placeholder={type === "expense" ? "Ex: Mercado" : "Ex: Bonus"}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <IconPicker selectedIcon={icon} onSelect={setIcon} />

              <Button className="w-full" type="submit" disabled={saving || !name.trim()}>
                <Plus className="size-4" aria-hidden="true" />
                {saving ? "Criando..." : "Criar categoria"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="size-5 text-primary" aria-hidden="true" />
              Categorias cadastradas
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <CategoryList
              title="Despesas"
              tone="expense"
              categories={groupedCategories.expense}
              selectedCategoryId={selectedCategory?.id}
              onSelect={selectCategory}
            />
            <CategoryList
              title="Receitas"
              tone="income"
              categories={groupedCategories.income}
              selectedCategoryId={selectedCategory?.id}
              onSelect={selectCategory}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Editar categoria</CardTitle>
            {selectedCategory ? (
              <Button variant="ghost" size="icon" type="button" onClick={() => setSelectedCategory(null)} aria-label="Fechar edicao">
                <X className="size-4" aria-hidden="true" />
              </Button>
            ) : null}
          </CardHeader>
          <CardContent>
            {selectedCategory ? (
              <form className="space-y-4" onSubmit={handleUpdate}>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Badge
                    className={cn(
                      "border-transparent",
                      selectedCategory.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    )}
                  >
                    {selectedCategory.type === "income" ? "Receita" : "Despesa"}
                  </Badge>
                </div>

                <IconPicker selectedIcon={editIcon} onSelect={setEditIcon} />

                <div className="space-y-2">
                  <Label htmlFor="edit-category-name">Nome</Label>
                  <Input
                    id="edit-category-name"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button type="submit" disabled={editing || !editName.trim()}>
                    <Pencil className="size-4" aria-hidden="true" />
                    {editing ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button type="button" variant="outline" disabled={deleting} onClick={handleDelete}>
                    <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                    {deleting ? "Excluindo..." : "Excluir"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Clique em uma categoria para editar ou excluir.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function CategoryList({
  categories,
  onSelect,
  selectedCategoryId,
  title,
  tone
}: {
  categories: Category[];
  onSelect: (category: Category) => void;
  selectedCategoryId?: string;
  title: string;
  tone: TransactionType;
}) {
  return (
    <section className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-semibold">{title}</h2>
        <Badge
          className={cn(
            "border-transparent",
            tone === "income" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          )}
        >
          {categories.length}
        </Badge>
      </div>

      {categories.length === 0 ? (
        <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">Nenhuma categoria cadastrada.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              className={cn(
                "inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                selectedCategoryId === category.id && "border-primary bg-primary/10 text-primary"
              )}
              key={category.id}
              type="button"
              onClick={() => onSelect(category)}
            >
              <CategoryIcon className="size-4" name={category.icon} aria-hidden="true" />
              {category.name}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function IconPicker({ onSelect, selectedIcon }: { onSelect: (icon: string) => void; selectedIcon: string }) {
  return (
    <div className="space-y-2">
      <Label>Icone</Label>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-7">
        {categoryIcons.map((item) => {
          return (
            <button
              aria-label={item.label}
              className={cn(
                "flex h-10 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                selectedIcon === item.name && "border-primary bg-primary/10 text-primary"
              )}
              key={item.name}
              title={item.label}
              type="button"
              onClick={() => onSelect(item.name)}
            >
              <CategoryIcon className="size-4" name={item.name} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
