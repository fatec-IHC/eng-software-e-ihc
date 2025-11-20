# 🍰 Sonho Doce - Sistema de Gestão para Padarias

Sistema completo de ponto de venda (PDV) e gestão desenvolvido com Next.js 16, TypeScript e Supabase.

## 📋 Funcionalidades

### Para Atendentes
- ✅ PDV (Ponto de Venda) completo
- ✅ Busca e filtro de produtos por categoria
- ✅ Carrinho de compras interativo
- ✅ Aplicação de desconto (com senha de gerente)
- ✅ Seleção de método de pagamento (Cartão, Dinheiro, Pix)
- ✅ Finalização de vendas com atualização automática de estoque

### Para Gerentes
- ✅ Dashboard com métricas de vendas
- ✅ Gerenciamento completo de produtos (CRUD)
- ✅ Relatório de vendas detalhado
- ✅ Controle de estoque
- ✅ Visualização de faturamento

## 🚀 Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Supabase** - Banco de dados e backend
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ ou superior
- pnpm (ou npm/yarn)
- Conta no Supabase

### Passos

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd eng-software-e-ihc
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Edite `.env.local` e adicione suas credenciais do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
   ```

4. **Configure o banco de dados**
   
   Acesse o SQL Editor no Supabase e execute o script:
   ```bash
   scripts/001_create_tables.sql
   ```
   
   Isso criará as tabelas necessárias:
   - `products` - Produtos
   - `sales` - Vendas
   - `sale_items` - Itens das vendas

5. **Execute o projeto**
   ```bash
   pnpm dev
   # ou
   npm run dev
   ```

6. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no navegador

## 🚀 Deploy no Vercel

### Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Projeto no GitHub/GitLab/Bitbucket (ou use o Vercel CLI)
- Credenciais do Supabase configuradas

### Método 1: Deploy via Dashboard Vercel (Recomendado)

1. **Acesse o Vercel Dashboard**
   - Vá para [vercel.com](https://vercel.com) e faça login
   - Clique em "Add New..." → "Project"

2. **Conecte seu repositório**
   - Conecte seu repositório Git (GitHub, GitLab ou Bitbucket)
   - Selecione o repositório `eng-software-e-ihc`

3. **Configure o projeto**
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `npm run build` (ou `pnpm build`)
   - **Output Directory**: `.next` (padrão do Next.js)
   - **Install Command**: `npm install` (ou `pnpm install`)

4. **Configure as variáveis de ambiente**
   
   Adicione as seguintes variáveis de ambiente no Vercel:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key
   ```
   
   **Como adicionar:**
   - Na página de configuração do projeto, vá em "Environment Variables"
   - Adicione cada variável:
     - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
     - **Value**: Sua URL do Supabase
     - **Environment**: Production, Preview, Development (marque todos)
   - Repita para `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Seu projeto estará disponível em `https://seu-projeto.vercel.app`

6. **Configurar domínio personalizado (opcional)**
   - Vá em "Settings" → "Domains"
   - Adicione seu domínio personalizado
   - Siga as instruções para configurar o DNS

### Método 2: Deploy via Vercel CLI

1. **Instale o Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Faça login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Durante o processo, você será perguntado:
   - Se deseja vincular a um projeto existente
   - Sobre as variáveis de ambiente (adicione-as quando solicitado)

4. **Deploy para produção**
   ```bash
   vercel --prod
   ```

### Configuração de Ambiente no Vercel

Após o primeiro deploy, você pode gerenciar as variáveis de ambiente:

1. Acesse seu projeto no [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em **Settings** → **Environment Variables**
3. Adicione/edite as variáveis conforme necessário
4. Clique em **Redeploy** para aplicar as mudanças

### Verificando o Deploy

Após o deploy, verifique:
- ✅ O build foi concluído com sucesso
- ✅ As variáveis de ambiente estão configuradas
- ✅ O site está acessível no URL fornecido
- ✅ A conexão com o Supabase está funcionando

### Troubleshooting

**Erro: "Missing Supabase environment variables"**
- Verifique se as variáveis estão configuradas no Vercel
- Certifique-se de que os nomes estão corretos: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Faça um redeploy após adicionar as variáveis

**Erro de build**
- Verifique os logs de build no Vercel Dashboard
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se não há erros de TypeScript

**CORS ou erros de conexão com Supabase**
- Verifique se a URL do Supabase está correta
- No Supabase Dashboard, vá em Settings → API e verifique as configurações de CORS

## 🔐 Login

Por padrão, o sistema usa autenticação simples:
- **Senha**: `1234`
- **Perfis disponíveis**: Atendente ou Gerente

> ⚠️ **Importante**: Para produção, implemente autenticação real com Supabase Auth.

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
│   └── utils.ts         # Funções utilitárias
├── scripts/             # Scripts SQL
│   └── 001_create_tables.sql
├── public/              # Arquivos estáticos
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
- `payment_method` (TEXT) - Método de pagamento
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
pnpm dev

# Build para produção
pnpm build

# Iniciar servidor de produção
pnpm start

# Lint
pnpm lint
```

## 🔒 Segurança

⚠️ **Atenção**: O projeto atual usa políticas RLS muito permissivas para facilitar o desenvolvimento. Para produção:

1. Implemente autenticação real com Supabase Auth
2. Ajuste as políticas RLS para restringir acesso
3. Adicione validação de permissões no backend
4. Use variáveis de ambiente seguras

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

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

Desenvolvido com ❤️ usando Next.js e Supabase

