# VarejoHub - Sistema de Gestão para Supermercados

Bem-vindo ao VarejoHub, uma solução completa para gerenciamento de supermercados. Este sistema é projetado com uma arquitetura de microsserviços no backend e uma interface moderna e reativa no frontend.

## Estrutura do Projeto

O repositório está organizado da seguinte forma:

```
/VarejoHub
|-- /backend         # Contém as APIs .NET do sistema
|   |-- VarejoHub.Api.Auth
|   |-- VarejoHub.Api.Management
|   |-- VarejoHub.Api.Query
|-- /frontend        # Contém a aplicação Next.js
|-- README.md        # Este arquivo
```

## Tecnologias Utilizadas

* **Backend**: C#, .NET, ASP.NET Core, Entity Framework Core, SQL Server
* **Frontend**: Next.js, React, TypeScript, Tailwind CSS
* **Banco de Dados**: SQL Server

---

## 🚀 Backend (.NET)

O backend é composto por três APIs principais, cada uma com sua responsabilidade:

* `VarejoHub.Api.Auth`: Gerencia autenticação e autorização de usuários.
* `VarejoHub.Api.Management`: Responsável por todas as operações de escrita (Cadastro, Edição, Exclusão).
* `VarejoHub.Api.Query`: Otimizada para consultas e leitura de dados.

### Modelo de Dados (Entidades Principais)

O sistema utiliza o Entity Framework Core (Code First) para gerenciar o banco de dados. As principais entidades são:

1.  `Supermercado` (Contratação)
2.  `Usuario` (Acesso e Funcionários)
3.  `Produto` (Estoque)
4.  `MovimentacaoEstoque` (Entrada, Saída, Perda)
5.  `Fornecedor`
6.  `Cliente` (Fidelidade)
7.  `Venda` (Transação PDV)
8.  `ItemVenda` (Detalhe da Venda)
9.  `TransacaoFinanceira` (Fluxo de Caixa)
10. `Plano`
11. `Assinatura` (Contrato de Plano)
12. `Fatura` (Cobrança)
13. `LogAuditoria` (Registro de Alterações)

### Configuração e Instalação (Backend)

**1. Pré-requisitos:**
* [.NET SDK](https://dotnet.microsoft.com/download) (versão 8 ou superior recomendada)
* [SQL Server](https://www.microsoft.com/pt-br/sql-server/sql-server-downloads) (Express, Developer ou outra edição)

**2. Configurar String de Conexão:**
Abra o arquivo `appsettings.json` em cada um dos projetos da API (`Auth`, `Management` e `Query`) e configure a `ConnectionStrings`.

**Exemplo:**
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost,3739;Database=VarejoHub;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=True;"
}
```
> **Atenção:** Certifique-se de que o servidor e o nome do banco de dados estão corretos para o seu ambiente.

**3. Criar o Banco de Dados (Migrações):**
Para criar o banco de dados e aplicar as tabelas, execute os seguintes comandos do Entity Framework. Recomenda-se executar a partir da pasta do projeto que contém o `DbContext` (provavelmente `VarejoHub.Api.Management`).

```bash
# Navegue até a pasta do projeto principal de gerenciamento
cd backend/VarejoHub.Api.Management

# Instale a ferramenta de linha de comando do EF Core (se ainda não tiver)
dotnet tool install --global dotnet-ef

# Aplique as migrações para criar/atualizar o banco de dados
dotnet ef database update
```

**4. Executar as APIs:**
Abra um terminal para cada API e execute o seguinte comando:

```bash
# No terminal 1
cd backend/VarejoHub.Api.Auth
dotnet run

# No terminal 2
cd backend/VarejoHub.Api.Management
dotnet run

# No terminal 3
cd backend/VarejoHub.Api.Query
dotnet run
```

---

## 🎨 Frontend (Next.js)

O frontend é uma aplicação Single Page Application (SPA) construída com Next.js, fornecendo uma interface de usuário rica e performática.

### Estrutura e Páginas

A aplicação utiliza o **App Router** do Next.js. A estrutura de pastas para as páginas fica dentro de `frontend/src/app/`.

**Exemplo de caminho de página:**
* A página de login estaria em: `frontend/src/app/(auth)/login/page.tsx`
* A listagem de produtos estaria em: `frontend/src/app/dashboard/produtos/page.tsx`

### Configuração e Instalação (Frontend)

**1. Pré-requisitos:**
* [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
* Um gerenciador de pacotes (NPM, Yarn ou PNPM)

**2. Instalar Dependências:**
Navegue até a pasta do frontend e instale os pacotes necessários.

```bash
cd frontend
npm install
```

**3. Pacotes Recomendados a Serem Instalados:**
Seu projeto provavelmente precisará de pacotes para comunicação com a API, gerenciamento de estado, formulários e componentes de UI. Execute o comando abaixo para instalar as bibliotecas mais comuns para este tipo de aplicação:

```bash
npm install axios @tanstack/react-query zod @hookform/resolvers lucide-react shadcn-ui tailwindcss-animate class-variance-authority clsx
```
* `axios`: Cliente HTTP para fazer requisições às APIs.
* `@tanstack/react-query`: Para gerenciamento de estado do servidor (fetching, caching, etc.).
* `zod` e `@hookform/resolvers`: Para validação de formulários.
* `lucide-react`: Pacote de ícones.
* `shadcn-ui` e suas dependências: Para componentes de UI reutilizáveis e estilizados com Tailwind CSS.

**4. Configurar Variáveis de Ambiente:**
Crie um arquivo chamado `.env.local` na raiz da pasta `frontend`. Nele, adicione as URLs base das suas APIs para que a aplicação saiba como se comunicar com o backend.

`frontend/.env.local`
```
NEXT_PUBLIC_API_AUTH_URL=http://localhost:5001
NEXT_PUBLIC_API_MANAGEMENT_URL=http://localhost:5002
NEXT_PUBLIC_API_QUERY_URL=http://localhost:5003
```
> **Atenção:** As portas (`5001`, `5002`, `5003`) são exemplos. Verifique em quais portas suas APIs estão rodando.

**5. Executar a Aplicação:**
Após a instalação e configuração, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação em funcionamento.

---

## 📋 Status de Implementação

### Backend - Completamente Implementado ✅

O backend está totalmente funcional com todos os componentes necessários:

#### Controllers Implementados (API Management)
- ✅ **AuthController** - Autenticação e autorização
- ✅ **UserController** - Gestão de usuários
- ✅ **ProductController** - Gestão de produtos
- ✅ **PlanController** - Gestão de planos de assinatura
- ✅ **ClientController** - Gestão de clientes
- ✅ **SupplierController** - Gestão de fornecedores
- ✅ **SaleController** - Gestão de vendas
- ✅ **StockMovementController** - Gestão de movimentação de estoque
- ✅ **SupermarketController** - Gestão de supermercados
- ✅ **SubscriptionController** - Gestão de assinaturas
- ✅ **InvoiceController** - Gestão de faturas
- ✅ **FinancialTransactionController** - Gestão de transações financeiras

#### Services Implementados
Todos os services estão implementados com:
- ✅ Operações CRUD completas
- ✅ Validações de negócio
- ✅ Tratamento de exceções
- ✅ Integração com repositórios

#### DTOs Criados
- ✅ UserDto, ProductDto, PlanoDto, SupermarketDto
- ✅ ClientDto, SupplierDto
- ✅ SaleDto, SaleItemDto
- ✅ StockMovementDto
- ✅ SubscriptionDto, InvoiceDto
- ✅ FinancialTransactionDto

#### Repositórios
Todos os repositórios implementados com:
- ✅ Operações CRUD básicas
- ✅ Queries específicas por entidade
- ✅ Integração com Entity Framework Core

### Frontend - Em Desenvolvimento 🚧

#### Completado
- ✅ **Estrutura base** - Layout, autenticação, providers
- ✅ **Páginas de autenticação** - Login, registro, callback
- ✅ **Páginas públicas** - Marketing, pricing, erros
- ✅ **Tipos TypeScript** - Todas as entidades tipadas em `src/types/entities.ts`
- ✅ **API Integration (parcial)** - Cliente já implementado como exemplo
- ✅ **Correções de linting** - Todos os erros corrigidos

#### Pendente (Próximos Passos)
- ⏳ **Dashboard Layout** - Criar estrutura de navegação principal
- ⏳ **Páginas de CRUD**:
  - Produtos (listagem, criar, editar, deletar)
  - Clientes (listagem, criar, editar, deletar)
  - Fornecedores (listagem, criar, editar, deletar)
  - Vendas (listagem, criar, visualizar detalhes)
  - Movimentação de Estoque (listagem, criar)
  - Usuários (listagem, criar, editar, deletar)
  - Transações Financeiras (listagem, criar)
- ⏳ **Páginas de Visualização**:
  - Dashboard principal com métricas
  - Assinatura e faturas
  - Configurações do supermercado
  - Relatórios
- ⏳ **API Requests** - Completar arquivos de requisição para todas as entidades
- ⏳ **Componentes Reutilizáveis** - DataTable, Forms, Modals, etc.

### Padrão de Implementação Frontend

Para criar novas páginas e integrações, siga o padrão estabelecido:

**1. API Requests** (exemplo em `src/api/management/client.ts`):
```typescript
import { managementApi } from "../api";
import { EntityType, Result } from "@/src/types/entities";

export async function getEntitiesBySupermarket(supermarketId: number): Promise<Result<EntityType[]>> {
    try {
        const response = await managementApi.get<EntityType[]>(`/entity/supermarket/${supermarketId}`);
        return { isSuccess: true, value: response.data, error: "" };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: /* error handling pattern */
        };
    }
}
```

**2. Páginas** (usar App Router do Next.js):
```
app/
  (dashboard)/
    products/
      page.tsx         # Listagem
      new/page.tsx     # Criar
      [id]/
        page.tsx       # Visualizar
        edit/page.tsx  # Editar
```

**3. Componentes Reutilizáveis**:
- Usar shadcn/ui components já configurados
- Seguir padrão de componentes existentes
- TypeScript estrito (sem `any`)

---

## 🔧 Melhorias Implementadas

### Backend
1. **Correções de Bugs**:
   - ✅ Corrigido rota com espaços no UserController
   - ✅ Corrigido método SearchByNameAsync usando Contains ao invés de Equals
   - ✅ Adicionado método SearchByNameAsync ao ClientRepository

2. **Padronização**:
   - ✅ Nomenclaturas PascalCase para C# mantidas
   - ✅ DTOs para todas as entidades
   - ✅ Injeção de dependências configurada

3. **Validações**:
   - ✅ Validações de negócio nos services
   - ✅ Operações imutáveis para vendas e items de venda
   - ✅ Lógica de atualização de estoque na movimentação

### Frontend
1. **Correções de Tipos**:
   - ✅ Removido todos os tipos `any` explícitos
   - ✅ Tratamento de erros com tipos adequados
   - ✅ Criados tipos para todas as entidades

2. **Padronização**:
   - ✅ Nomenclaturas camelCase para TypeScript
   - ✅ Estrutura de pastas organizada
   - ✅ Pattern de API requests estabelecido

---

## 🎯 Próximos Passos para Desenvolvedores

Para continuar o desenvolvimento do frontend:

1. **Criar API Requests**:
   - Usar `src/api/management/client.ts` como template
   - Criar arquivos para: supplier, sale, stock-movement, supermarket, subscription, invoice, financial-transaction

2. **Implementar Dashboard**:
   - Criar layout em `app/(dashboard)/layout.tsx`
   - Implementar sidebar com navegação
   - Adicionar header com informações do usuário

3. **Criar Páginas CRUD**:
   - Começar com produtos (mais simples)
   - Usar DataTable component (a ser criado com shadcn/ui)
   - Implementar formulários com react-hook-form + zod

4. **Componentes Reutilizáveis**:
   - DataTable com paginação e busca
   - Form components com validação
   - Modal dialogs para ações
   - Toast notifications (já configurado com sonner)

5. **Testes**:
   - Testar cada endpoint do backend
   - Validar fluxos completos de CRUD
   - Testar integrações entre entidades

---

## 📚 Documentação da API

### Endpoints Disponíveis

#### Autenticação
- `POST /auth/register` - Registrar novo supermercado e usuário admin
- `POST /auth/magic-link` - Gerar link mágico de acesso

#### Usuários
- `GET /user/me` - Obter dados do usuário logado
- `GET /user/supermarket/{supermarketId}` - Listar usuários por supermercado
- `GET /user/{id}` - Obter usuário por ID
- `POST /user` - Criar novo usuário
- `PUT /user/{id}` - Atualizar usuário
- `DELETE /user/{id}` - Deletar usuário

#### Produtos
- `GET /product/supermarket/{supermarketId}/products` - Listar produtos
- `GET /product/{id}` - Obter produto por ID
- `POST /product` - Criar produto
- `PUT /product/{id}` - Atualizar produto
- `DELETE /product/{id}` - Deletar produto
- `GET /product/supermarket/{supermarketId}/products/low-stock` - Alertas de estoque baixo
- `GET /product/supermarket/{supermarketId}/products/search?name={name}` - Buscar produtos

#### Clientes
- `GET /client/supermarket/{supermarketId}` - Listar clientes
- `GET /client/{id}` - Obter cliente por ID
- `POST /client` - Criar cliente
- `PUT /client/{id}` - Atualizar cliente
- `DELETE /client/{id}` - Deletar cliente
- `GET /client/supermarket/{supermarketId}/search?name={name}` - Buscar clientes

#### Fornecedores
- `GET /supplier/supermarket/{supermarketId}` - Listar fornecedores
- `GET /supplier/{id}` - Obter fornecedor por ID
- `POST /supplier` - Criar fornecedor
- `PUT /supplier/{id}` - Atualizar fornecedor
- `DELETE /supplier/{id}` - Deletar fornecedor

#### Vendas
- `GET /sale/supermarket/{supermarketId}` - Listar vendas
- `GET /sale/{id}` - Obter venda por ID
- `POST /sale` - Registrar venda
- `GET /sale/supermarket/{supermarketId}/daterange?startDate={date}&endDate={date}` - Vendas por período
- `GET /sale/client/{clientId}` - Vendas por cliente

#### Movimentação de Estoque
- `GET /stockmovement/supermarket/{supermarketId}` - Listar movimentações
- `GET /stockmovement/{id}` - Obter movimentação por ID
- `POST /stockmovement` - Registrar movimentação
- `GET /stockmovement/product/{productId}` - Movimentações por produto

#### Supermercados
- `GET /supermarket` - Listar todos os supermercados
- `GET /supermarket/{id}` - Obter supermercado por ID
- `POST /supermarket` - Criar supermercado
- `PUT /supermarket/{id}` - Atualizar supermercado
- `DELETE /supermarket/{id}` - Deletar supermercado

#### Assinaturas
- `GET /subscription` - Listar assinaturas
- `GET /subscription/{id}` - Obter assinatura por ID
- `GET /subscription/supermarket/{supermarketId}` - Assinatura por supermercado
- `POST /subscription` - Criar assinatura
- `PUT /subscription/{id}` - Atualizar assinatura

#### Faturas
- `GET /invoice/{id}` - Obter fatura por ID
- `GET /invoice/subscription/{subscriptionId}` - Faturas por assinatura
- `GET /invoice/supermarket/{supermarketId}` - Faturas por supermercado
- `POST /invoice` - Criar fatura
- `PUT /invoice/{id}` - Atualizar fatura
- `GET /invoice/overdue` - Listar faturas vencidas

#### Transações Financeiras
- `GET /financialtransaction/supermarket/{supermarketId}` - Listar transações
- `GET /financialtransaction/{id}` - Obter transação por ID
- `POST /financialtransaction` - Criar transação
- `PUT /financialtransaction/{id}` - Atualizar transação
- `DELETE /financialtransaction/{id}` - Deletar transação
- `GET /financialtransaction/supermarket/{supermarketId}/balance` - Obter saldo

> **Nota**: Todos os endpoints (exceto autenticação) requerem autenticação via JWT Bearer token.