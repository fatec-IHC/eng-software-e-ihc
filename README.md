# 🍰 Sonho Doce - Sistema de Gestão para Padarias

Sistema completo de ponto de venda (PDV) e gestão desenvolvido com Next.js 16, TypeScript e Supabase.

## 📋 Funcionalidades

### Para Atendentes
- ✅ PDV (Ponto de Venda) completo
- ✅ Busca e filtro de produtos por categoria
- ✅ Carrinho de compras interativo
- ✅ Seleção de método de pagamento (Cartão, Dinheiro, Pix)
- ✅ Finalização de vendas com atualização automática de estoque

### Para Gerentes
- ✅ Dashboard com métricas de vendas
- ✅ Gerenciamento completo de produtos (CRUD)
- ✅ Relatório de vendas detalhado
- ✅ Controle de estoque
- ✅ Visualização de faturamento
- ✅ Paginação e filtros na tela de produtos

## 🚀 Tecnologias

- **Next.js 16** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Supabase** - Banco de dados e backend
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Lucide React** - Ícones

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ ou superior
- npm, pnpm ou yarn
- Conta no Supabase (gratuita)

### Passo 1: Clone o Repositório

```bash
git clone https://github.com/fatec-IHC/eng-software-e-ihc.git
cd eng-software-e-ihc
```

### Passo 2: Instale as Dependências

```bash
npm install
# ou
pnpm install
```

### Passo 3: Configure as Variáveis de Ambiente

1. Copie o arquivo de exemplo:
   ```bash
   cp env.example.txt .env.local
   ```

2. Edite `.env.local` e adicione suas credenciais do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
   ```

   **Como obter as credenciais:**
   - Acesse: https://app.supabase.com/project/_/settings/api
   - Copie a **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copie a **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Passo 4: Configure o Banco de Dados

1. Acesse o **SQL Editor** no Supabase Dashboard
2. Execute o script: `scripts/001_create_tables.sql`

   Isso criará as tabelas necessárias:
   - `products` - Produtos
   - `sales` - Vendas
   - `sale_items` - Itens das vendas

### Passo 5: Execute o Projeto

```bash
npm run dev
# ou
pnpm dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🔐 Login

Por padrão, o sistema usa autenticação simples:
- **Senha**: `1234`
- **Perfis disponíveis**: Atendente ou Gerente

> ⚠️ **Importante**: Para produção, implemente autenticação real com Supabase Auth.

## 🚀 Deploy no GitHub Pages

Este projeto está configurado para deploy automático no GitHub Pages.

### Configuração Inicial

#### 1. Adicione os Secrets no GitHub

1. Vá para: `https://github.com/fatec-IHC/eng-software-e-ihc/settings/secrets/actions`
2. Clique em **"New repository secret"** e adicione:

   **Secret 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Sua URL do Supabase (ex: `https://xxxxx.supabase.co`)

   **Secret 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Sua chave anon do Supabase

#### 2. Habilite o GitHub Pages

1. Vá para: `https://github.com/fatec-IHC/eng-software-e-ihc/settings/pages`
2. Em **Source**, selecione: **GitHub Actions**
3. Clique em **Save**

#### 3. Deploy Automático

O deploy acontece automaticamente quando você faz push para a branch `main`:

```bash
git push origin main
```

### Monitoramento do Deploy

- Acompanhe o progresso em: `https://github.com/fatec-IHC/eng-software-e-ihc/actions`
- O workflow "Deploy to GitHub Pages" será executado automaticamente
- Aguarde 2-5 minutos para o deploy completar

### URL do Site

Após o deploy, seu site estará disponível em:
**https://fatec-ihc.github.io/eng-software-e-ihc/**

### Notas Importantes

- **Primeiro deploy**: Pode levar 5-10 minutos
- **Deploys subsequentes**: Geralmente 2-5 minutos
- **Base Path**: Todas as URLs são prefixadas com `/eng-software-e-ihc/`

## 📁 Estrutura do Projeto

```
eng-software-e-ihc/
├── app/                    # App Router do Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal (PDV/Admin)
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   └── theme-provider.tsx
├── lib/                  # Utilitários e configurações
│   ├── supabase/        # Clientes Supabase
│   ├── utils/           # Funções utilitárias
│   └── validations.ts   # Schemas Zod
├── scripts/             # Scripts SQL
│   └── 001_create_tables.sql
├── public/              # Arquivos estáticos
│   └── logo.jpg        # Logo da aplicação
├── .github/
│   └── workflows/
│       └── deploy.yml  # Workflow de deploy
└── hooks/              # Custom hooks
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: `products`
- `id` (UUID) - Identificador único
- `name` (TEXT) - Nome do produto
- `price` (DECIMAL) - Preço unitário
- `category` (TEXT) - Categoria (Pães, Doces, Salgados, Bolos, Bebidas)
- `stock` (INTEGER) - Quantidade em estoque
- `image` (TEXT) - Emoji ou URL da imagem
- `created_at` (TIMESTAMP) - Data de criação

### Tabela: `sales`
- `id` (UUID) - Identificador único
- `total` (DECIMAL) - Valor total da venda
- `payment_method` (TEXT) - Método de pagamento (Cartão, Dinheiro, Pix)
- `created_at` (TIMESTAMP) - Data da venda

### Tabela: `sale_items`
- `id` (UUID) - Identificador único
- `sale_id` (UUID) - Referência à venda
- `product_id` (UUID) - Referência ao produto
- `product_name` (TEXT) - Nome do produto (snapshot)
- `product_price` (DECIMAL) - Preço do produto (snapshot)
- `quantity` (INTEGER) - Quantidade vendida
- `created_at` (TIMESTAMP) - Data de criação

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Lint
npm run lint

# Instalar dependências (com fallback para peer deps)
npm run install-deps
```

## 🔒 Segurança

⚠️ **Atenção**: O projeto atual usa políticas RLS muito permissivas para facilitar o desenvolvimento. Para produção:

1. Implemente autenticação real com Supabase Auth
2. Ajuste as políticas RLS para restringir acesso
3. Adicione validação de permissões no backend
4. Use variáveis de ambiente seguras
5. Não commite arquivos `.env.local` no repositório

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env.local` existe
- Confirme que as variáveis estão corretas
- Reinicie o servidor de desenvolvimento

### Erro: "Build fails" no GitHub Pages
- Verifique se os secrets estão configurados no GitHub
- Confirme que `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão definidos
- Veja os logs em: `https://github.com/fatec-IHC/eng-software-e-ihc/actions`

### Assets não carregam (404 errors) no GitHub Pages
- Verifique se GitHub Pages está configurado para usar "GitHub Actions" como source
- Confirme que o `basePath` está correto no `next.config.mjs`

### Erro ao conectar com Supabase
- Verifique se as credenciais estão corretas
- Confirme que o projeto Supabase está ativo
- Verifique as políticas RLS no Supabase Dashboard

## 🚧 Melhorias Futuras

- [ ] Autenticação real com Supabase Auth
- [ ] Sistema de usuários e permissões
- [ ] Relatórios avançados com gráficos
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Histórico de alterações de estoque
- [ ] Alertas de estoque baixo
- [ ] Suporte a múltiplas unidades
- [ ] Integração com impressoras térmicas
- [ ] App mobile (React Native)

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais.

## 👥 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

Desenvolvido com ❤️ usando Next.js e Supabase
