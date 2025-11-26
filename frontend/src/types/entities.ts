// Entity Types

export interface Client {
    idCliente: number;
    idSupermercado: number;
    nome: string;
    cpf?: string;
    email?: string;
    pontosFidelidade: number;
}

export interface Supplier {
    idFornecedor: number;
    idSupermercado: number;
    nomeFantasia: string;
    cnpj?: string;
    email?: string;
    telefone?: string;
}

export interface Product {
    idProduto: number;
    idSupermercado: number;
    nome: string;
    descricao?: string;
    codigoBarras?: string;
    precoVenda: number;
    precoCusto?: number;
    estoqueAtual: number;
    alertaBaixoEstoque?: number;
    unidade?: string;
}

export interface Sale {
    idVenda: number;
    idSupermercado: number;
    idUsuarioCaixa?: number;
    idCliente?: number;
    dataHora: string;
    valorTotal: number;
    cupomFiscalNumero?: string;
    itens?: SaleItem[];
}

export interface SaleItem {
    idItemVenda: number;
    idVenda: number;
    idProduto: number;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
    nomeProduto?: string;
}

export interface StockMovement {
    idMovimentacao: number;
    idSupermercado: number;
    idProduto: number;
    tipoMovimentacao: 'Entrada' | 'Saida_Venda' | 'Perda' | 'Vencimento' | 'Ajuste';
    quantidade: number;
    dataHora: string;
    notaFiscalRef?: string;
    nomeProduto?: string;
}

export interface Supermarket {
    idSupermercado: number;
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    email?: string;
    telefone?: string;
}

export interface Subscription {
    idAssinatura: number;
    idSupermercado: number;
    idPlano: number;
    dataInicioVigencia: string;
    dataProximoVencimento: string;
    dataCancelamento?: string;
    statusAssinatura: 'Ativa' | 'Trial' | 'Inadimplente' | 'Cancelada' | 'Bloqueada';
    nomePlano?: string;
}

export interface Invoice {
    idFatura: number;
    idAssinatura: number;
    idSupermercado: number;
    valor: number;
    dataVencimento: string;
    dataPagamento?: string;
    statusFatura: 'Aberta' | 'Paga' | 'Vencida' | 'Cancelada';
}

export interface FinancialTransaction {
    idTransacao: number;
    idSupermercado: number;
    tipoTransacao: 'Receita' | 'Despesa';
    descricao: string;
    valor: number;
    dataVencimento?: string;
    dataPagamentoRecebimento?: string;
    status: 'Pendente' | 'Pago' | 'Recebido' | 'Cancelado';
    categoria?: string;
}

export interface Plan {
    idPlano: number;
    nomePlano: string;
    descricao?: string;
    precoMensal: number;
    limiteUsuarios?: number;
    limiteProdutos?: number;
    ativo: boolean;
}

// Result Type for API responses
export interface Result<T> {
    isSuccess: boolean;
    value?: T;
    error: string;
}
