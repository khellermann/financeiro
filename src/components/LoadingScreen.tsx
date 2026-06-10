export function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="size-9 animate-spin rounded-full border-4 border-muted border-t-primary" role="status" aria-label="Carregando" />
    </main>
  );
}
