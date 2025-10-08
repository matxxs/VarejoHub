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