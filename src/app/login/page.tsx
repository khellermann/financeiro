"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { WalletCards } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewMode = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "preview-key";

  async function signInWithGoogle() {
    if (previewMode) {
      window.location.href = "/dashboard";
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback`
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(120deg,rgba(15,118,110,0.92),rgba(15,23,42,0.92)),url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <WalletCards className="size-6" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold tracking-normal">Controle Financeiro</h1>
            <p className="mt-2 text-sm text-muted-foreground">Entre para acompanhar suas receitas e despesas.</p>
          </div>

          {error ? <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

          <Button type="button" className="h-11 w-full" onClick={signInWithGoogle} disabled={loading}>
            {loading ? "Conectando..." : previewMode ? "Ver demonstracao" : "Entrar com Google"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
