# Guia de Finalização da Implementação - VarejoHub

Este documento descreve o trabalho realizado para finalizar as implementações pendentes no projeto VarejoHub e fornece instruções para completar o desenvolvimento do frontend.

## ✅ Trabalho Completado

### Backend (100% Implementado)

#### 1. DTOs Criados
Todos os DTOs necessários foram criados em `backend/VarejoHub.Application/DTOs/`:
- ClientDto.cs
- SupplierDto.cs
- ProductDto.cs
- SaleDto.cs
- SaleItemDto.cs
- StockMovementDto.cs
- SubscriptionDto.cs
- InvoiceDto.cs
- FinancialTransactionDto.cs

#### 2. Interfaces de Serviço Criadas
Todas as interfaces de serviço foram criadas em `backend/VarejoHub.Application/Interfaces/Services/`:
- IClientService.cs
- ISupplierService.cs
- ISaleService.cs
- ISaleItemService.cs
- IStockMovementService.cs
- ISupermarketService.cs
- ISubscriptionService.cs
- IInvoiceService.cs
- IFinancialTransactionService.cs

#### 3. Implementações de Serviço
Todos os services foram implementados em `backend/VarejoHub.Application/Services/`:
- ClientService.cs
- SupplierService.cs
- SaleService.cs
- SaleItemService.cs
- StockMovementService.cs (com lógica de atualização de estoque)
- SupermarketService.cs
- SubscriptionService.cs
- InvoiceService.cs
- FinancialTransactionService.cs

#### 4. Controllers Criados
Todos os controllers foram criados em `backend/VarejoHub.Api.Management/Controllers/`:
- ClientController.cs
- SupplierController.cs
- SaleController.cs
- StockMovementController.cs
- SupermarketController.cs
- SubscriptionController.cs
- InvoiceController.cs
- FinancialTransactionController.cs

#### 5. Correções Realizadas
- ✅ Corrigida rota com espaços no UserController (linha 45)
- ✅ Corrigido método SearchByNameAsync nos repositórios (Product, Supplier, Client)
- ✅ Adicionado método SearchByNameAsync no ClientRepository
- ✅ Configurada injeção de dependências no Program.cs

#### 6. Validações e Regras de Negócio
- Vendas e items de venda são imutáveis após criação
- Movimentação de estoque atualiza automaticamente o estoque do produto
- Assinaturas e faturas podem ser canceladas (não deletadas)
- Validações de limites de planos implementadas no ProductService

### Frontend (Parcialmente Implementado)

#### 1. Correções de Linting
- ✅ Removidos todos os tipos `any` explícitos
- ✅ Corrigido tratamento de erros com tipos adequados
- ✅ Removida variável não utilizada em use-auth.ts

#### 2. Tipos TypeScript
- ✅ Criado arquivo `src/types/entities.ts` com todas as entidades tipadas
- ✅ Interface Result<T> para respostas de API
- ✅ Tipos para todas as entidades do domínio

#### 3. API Integration (Exemplo)
- ✅ Criado `src/api/management/client.ts` como template para outros arquivos

## 🚧 Trabalho Pendente no Frontend

### 1. Criar Arquivos de API Requests

Criar arquivos seguindo o padrão de `client.ts` para:

```
src/api/management/
├── supplier.ts
├── sale.ts
├── stock-movement.ts
├── supermarket.ts
├── subscription.ts
├── invoice.ts
└── financial-transaction.ts
```

**Template a seguir:**
```typescript
import { managementApi } from "../api";
import { EntityType, Result } from "@/src/types/entities";

export async function getEntitiesBySupermarket(supermarketId: number): Promise<Result<EntityType[]>> {
    try {
        const response = await managementApi.get<EntityType[]>(`/entity/supermarket/${supermarketId}`);
        return {
            isSuccess: true,
            value: response.data,
            error: "",
        };
    } catch (error: unknown) {
        return {
            isSuccess: false,
            error: error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string' ? error.response.data.message : "Erro ao buscar entidades",
        };
    }
}

// Implementar: create, update, delete, getById, etc.
```

### 2. Criar Estrutura de Dashboard

```
app/(dashboard)/
├── layout.tsx          # Layout principal do dashboard com sidebar e header
├── page.tsx            # Dashboard principal com métricas
├── products/
│   ├── page.tsx        # Listagem de produtos
│   ├── new/
│   │   └── page.tsx    # Criar produto
│   └── [id]/
│       ├── page.tsx    # Visualizar produto
│       └── edit/
│           └── page.tsx # Editar produto
├── clients/
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [id]/...
├── suppliers/
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [id]/...
├── sales/
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [id]/page.tsx
├── stock-movements/
│   ├── page.tsx
│   └── new/page.tsx
├── users/
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [id]/...
├── financial/
│   ├── transactions/
│   │   ├── page.tsx
│   │   └── new/page.tsx
│   └── invoices/
│       └── page.tsx
├── settings/
│   ├── supermarket/page.tsx
│   └── subscription/page.tsx
└── reports/
    └── page.tsx
```

### 3. Componentes Reutilizáveis a Criar

#### DataTable Component
Criar componente reutilizável com:
- Paginação
- Busca/filtro
- Ordenação
- Ações por linha (editar, deletar, visualizar)

```typescript
// components/data-table.tsx
interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onView?: (item: T) => void;
    searchPlaceholder?: string;
}
```

#### Form Components
Criar componentes de formulário com validação:
- TextInput
- NumberInput
- SelectInput
- DateInput
- CurrencyInput

Usar react-hook-form + zod para validação.

#### Modal Components
- ConfirmDialog
- FormDialog
- DetailDialog

### 4. React Query Hooks

Criar hooks customizados para cada entidade:

```typescript
// src/hooks/use-products.ts
export function useProducts(supermarketId: number) {
    return useQuery({
        queryKey: ['products', supermarketId],
        queryFn: () => getProductsBySupermarket(supermarketId)
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Produto criado com sucesso!');
        }
    });
}

// Criar hooks similares para update, delete
```

### 5. Formulários com Validação

Exemplo de formulário de produto:

```typescript
// app/(dashboard)/products/new/page.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const productSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    descricao: z.string().optional(),
    codigoBarras: z.string().optional(),
    precoVenda: z.number().positive('Preço deve ser maior que zero'),
    precoCusto: z.number().positive().optional(),
    estoqueAtual: z.number().min(0, 'Estoque não pode ser negativo'),
    alertaBaixoEstoque: z.number().min(0).optional(),
    unidade: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema)
    });

    const createMutation = useCreateProduct();

    const onSubmit = (data: ProductFormData) => {
        createMutation.mutate({
            ...data,
            idSupermercado: user.supermercado.idSupermercado
        });
    };

    // Renderizar formulário
}
```

### 6. Sidebar Navigation

Criar componente de navegação lateral:

```typescript
// components/dashboard-sidebar.tsx
const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Produtos', icon: Package, href: '/dashboard/products' },
    { label: 'Clientes', icon: Users, href: '/dashboard/clients' },
    { label: 'Fornecedores', icon: Truck, href: '/dashboard/suppliers' },
    { label: 'Vendas', icon: ShoppingCart, href: '/dashboard/sales' },
    { label: 'Estoque', icon: Warehouse, href: '/dashboard/stock-movements' },
    { label: 'Financeiro', icon: DollarSign, href: '/dashboard/financial' },
    { label: 'Usuários', icon: UserCog, href: '/dashboard/users' },
    { label: 'Configurações', icon: Settings, href: '/dashboard/settings' },
];
```

## 📋 Checklist de Implementação

### API Requests
- [ ] supplier.ts
- [ ] sale.ts
- [ ] stock-movement.ts
- [ ] supermarket.ts
- [ ] subscription.ts
- [ ] invoice.ts
- [ ] financial-transaction.ts

### Componentes Base
- [ ] DataTable
- [ ] FormField components
- [ ] Modal/Dialog components
- [ ] Dashboard Sidebar
- [ ] Dashboard Header

### Páginas - Produtos
- [ ] Listagem
- [ ] Criar
- [ ] Editar
- [ ] Visualizar
- [ ] Buscar

### Páginas - Clientes
- [ ] Listagem
- [ ] Criar
- [ ] Editar
- [ ] Visualizar

### Páginas - Fornecedores
- [ ] Listagem
- [ ] Criar
- [ ] Editar
- [ ] Visualizar

### Páginas - Vendas
- [ ] Listagem
- [ ] Nova venda (com items)
- [ ] Visualizar detalhes

### Páginas - Movimentação de Estoque
- [ ] Listagem
- [ ] Registrar movimentação

### Páginas - Usuários
- [ ] Listagem
- [ ] Criar
- [ ] Editar

### Páginas - Financeiro
- [ ] Transações (listagem e criar)
- [ ] Faturas (listagem)
- [ ] Relatório de saldo

### Páginas - Configurações
- [ ] Dados do supermercado
- [ ] Assinatura e plano
- [ ] Perfil do usuário

### Dashboard Principal
- [ ] Cards com métricas principais
- [ ] Gráfico de vendas
- [ ] Produtos com estoque baixo
- [ ] Últimas vendas
- [ ] Faturas pendentes

## 🔍 Testes Manuais Recomendados

### Backend
1. Testar todos os endpoints com Postman/Insomnia
2. Validar respostas de sucesso e erro
3. Testar autenticação e autorização
4. Validar regras de negócio

### Frontend
1. Testar criação de cada entidade
2. Testar edição e atualização
3. Testar deleção (com confirmação)
4. Validar mensagens de erro
5. Validar navegação entre páginas
6. Testar responsividade

## 📝 Padrões de Código

### TypeScript
- Usar tipos estritos (sem `any`)
- Interfaces para objetos
- Type unions para estados
- Async/await para operações assíncronas

### React
- Componentes funcionais
- Hooks para estado e efeitos
- Componentes controlados para formulários
- Memoização quando necessário

### Estilo
- Tailwind CSS para estilização
- shadcn/ui para componentes base
- Consistência visual entre páginas

## 🚀 Como Executar o Projeto Completo

### Backend
```bash
cd backend/VarejoHub.Api.Management
dotnet ef database update
dotnet run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📞 Suporte

Para dúvidas sobre a implementação:
1. Consulte o README.md principal
2. Revise os exemplos já implementados
3. Siga os padrões estabelecidos nos arquivos existentes
