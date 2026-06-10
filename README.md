# Controle Financeiro

Aplicacao em Next.js com Supabase Auth via Google, Tailwind CSS v4 e componentes no padrao shadcn/ui.

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Crie `.env.local` a partir de `.env.example`.

3. No Supabase, execute o SQL em `supabase/schema.sql`.

4. Em Supabase Auth > Providers, habilite Google.

5. Em Supabase Auth > URL Configuration, configure:

```text
Site URL: http://localhost:3000
Redirect URLs:
http://localhost:3000/auth/callback
```

6. Rode o projeto:

```bash
npm run dev
```

## Estrutura

- `/login`: entrada com Google.
- `/dashboard`: resumo financeiro.
- `/transactions/new`: cadastro de lancamentos.
- `/transactions`: historico e filtros.
- `/categories`: cadastro, edicao, exclusao e icones das categorias.
- `/auth/callback`: callback OAuth do Supabase.
- `supabase/schema.sql`: tabelas, indices e politicas RLS.

## Categorias

As categorias ficam vinculadas ao tipo do lancamento:

- Despesa: mostra apenas categorias de despesa.
- Receita: mostra apenas categorias de receita.

Na tela de categorias, escolha um icone ao criar ou editar. Clique em uma categoria cadastrada para editar nome/icone ou excluir. Ao renomear, os lancamentos existentes daquele tipo tambem recebem o novo nome da categoria.

## Pessoa fisica e juridica

Todo lancamento possui uma natureza:

- Pessoa juridica: padrao para contas da empresa.
- Pessoa fisica: marque quando for conta pessoal.

Na tela de lancamentos, use o filtro `Consolidado`, `Fisica` ou `Juridica` para ver tudo junto ou separado.
