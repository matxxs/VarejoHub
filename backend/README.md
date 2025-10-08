# Supermercado App - Arquitetura MVC com EF Core (Code First)

Este projeto implementa o backend de um sistema de gestão para supermercados utilizando a arquitetura Model-View-Controller (MVC) em ASP.NET Core e Entity Framework Core (EF Core) com a abordagem Code First para a geração do banco de dados.

## ⚙️ Tecnologias Utilizadas

* **Linguagem:** C#
* **Framework:** ASP.NET Core (MVC)
* **ORM (Mapeamento Objeto-Relacional):** Entity Framework Core (EF Core)
* **Abordagem de Banco de Dados:** Code First (Migrações)
* **Banco de Dados:** SQL Server (ou LocalDB para desenvolvimento)
* **Padrão de Projeto:** Model-View-Controller (MVC)

## 🗃️ Estrutura do Banco de Dados

O banco de dados é gerado a partir dos modelos (entidades C#) via Migrações do EF Core, e reflete as seguintes 13 tabelas:

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

## 🚀 Como Executar o Projeto

### Pré-requisitos

* .NET SDK (Versão utilizada no projeto)
* Visual Studio (Recomendado) ou Visual Studio Code
* SQL Server LocalDB (Geralmente incluído no Visual Studio)

### Passos de Configuração

#### 1. Configurar a String de Conexão

Abra o arquivo `appsettings.json` e verifique a string de conexão. Se você estiver usando o SQL Server LocalDB padrão, a string abaixo deve funcionar:

```json
"ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=SupermercadoDB;Trusted_Connection=True;MultipleActiveResultSets=true"
}