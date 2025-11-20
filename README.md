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

## 🚀 Deploy no GitHub Pages

Este projeto está configurado para deploy automático no GitHub Pages. Veja a seção de deploy no README ou consulte a documentação de GitHub Pages para mais detalhes.

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

