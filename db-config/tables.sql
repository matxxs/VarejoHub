-- 1. Tabela Supermercado (Contratação)
CREATE TABLE Supermercado (
    id_supermercado INT PRIMARY KEY IDENTITY(1,1),
    nome_fantasia NVARCHAR(100) NOT NULL,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    data_adesao DATETIME DEFAULT GETDATE(),
    status VARCHAR(20) NOT NULL CHECK (status IN ('Ativo', 'Suspenso', 'Trial')),
	data_inicio_trial DATE NULL; 
);
GO

-- 2. Tabela Usuario (Acesso e Funcionários)
CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY IDENTITY(1,1),
    id_supermercado INT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    nome NVARCHAR(100) NOT NULL,
    nivel_acesso VARCHAR(20) NOT NULL CHECK (nivel_acesso IN ('Administrador', 'Gerente', 'Caixa', 'Financeiro')),
    token_acesso_temporario VARCHAR(60), 
    data_expiracao_token DATETIME,
    confirmado BIT DEFAULT 0,
	e_global_admin BIT DEFAULT 0 NOT NULL,
    
    CONSTRAINT FK_Usuario_Supermercado 
        FOREIGN KEY (id_supermercado) 
        REFERENCES Supermercado(id_supermercado)
);
GO

-- 3. Tabela Produto (Estoque)
CREATE TABLE Produto (
    id_produto INT PRIMARY KEY IDENTITY(1,1),
    id_supermercado INT NOT NULL, 
    codigo_barras VARCHAR(20),
    nome NVARCHAR(150) NOT NULL,
    unidade_medida VARCHAR(10) NOT NULL CHECK (unidade_medida IN ('UN', 'KG', 'L', 'PCT')),
    estoque_atual DECIMAL(10, 3) NOT NULL,
    preco_custo DECIMAL(10, 2),
    preco_venda DECIMAL(10, 2) NOT NULL,
    alerta_baixo_estoque INT DEFAULT 5, 
    data_cadastro DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT FK_Produto_Supermercado 
        FOREIGN KEY (id_supermercado) 
        REFERENCES Supermercado(id_supermercado)
);
GO

-- 4. Tabela Movimentacao_Estoque (Entrada, Perdas, Vencimento)
CREATE TABLE Movimentacao_Estoque (
    id_movimentacao INT PRIMARY KEY IDENTITY(1,1),
    id_supermercado INT NOT NULL,
    id_produto INT NOT NULL,
    tipo_movimentacao VARCHAR(20) NOT NULL CHECK (tipo_movimentacao IN ('Entrada', 'Saida_Venda', 'Perda', 'Vencimento', 'Ajuste')),
    quantidade DECIMAL(10, 3) NOT NULL,
    data_hora DATETIME DEFAULT GETDATE(),
    nota_fiscal_ref NVARCHAR(50), 
    
    CONSTRAINT FK_Movimentacao_Produto 
        FOREIGN KEY (id_produto) 
        REFERENCES Produto(id_produto)
);
GO

-- 5. Tabela Fornecedor
CREATE TABLE Fornecedor (
    id_fornecedor INT PRIMARY KEY IDENTITY(1,1),
    id_supermercado INT NOT NULL,
    nome_fantasia NVARCHAR(100) NOT NULL,
    cnpj VARCHAR(14) UNIQUE,
    email NVARCHAR(100),
    telefone VARCHAR(20),
    
    CONSTRAINT FK_Fornecedor_Supermercado 
        FOREIGN KEY (id_supermercado) 
        REFERENCES Supermercado(id_supermercado)
);
GO

-- 6. Tabela Cliente (Programa de Fidelidade/Ofertas)
CREATE TABLE Cliente (
    id_cliente INT PRIMARY KEY IDENTITY(1,1),
    id_supermercado INT NOT NULL,
    nome NVARCHAR(100) NOT NULL,
    cpf VARCHAR(11) UNIQUE,
    email NVARCHAR(100),
    pontos_fidelidade INT DEFAULT 0, -- Pontos do programa de fidelidade
    
    CONSTRAINT FK_Cliente_Supermercado 
        FOREIGN KEY (id_supermercado) 
        REFERENCES Supermercado(id_supermercado)
);
GO

-- 7. Tabela Venda (Transação PDV)
CREATE TABLE Venda (
    id_venda INT PRIMARY KEY IDENTITY(1,1),
    id_supermercado INT NOT NULL,
    id_usuario_caixa INT,
    id_cliente INT NOT NULL, -- Opicional
    data_hora DATETIME DEFAULT GETDATE(),
    valor_total DECIMAL(10, 2) NOT NULL,
    cupom_fiscal_numero NVARCHAR(50),
    
    CONSTRAINT FK_Venda_Supermercado 
        FOREIGN KEY (id_supermercado) 
        REFERENCES Supermercado(id_supermercado),
        
    CONSTRAINT FK_Venda_Usuario 
        FOREIGN KEY (id_usuario_caixa) 
        REFERENCES Usuario(id_usuario),
        
    CONSTRAINT FK_Venda_Cliente 
        FOREIGN KEY (id_cliente) 
        REFERENCES Cliente(id_cliente)
);
GO

-- 8. Tabela Item_Venda (Detalhe dos Produtos na Venda)
CREATE TABLE Item_Venda (
    id_item_venda INT PRIMARY KEY IDENTITY(1,1),
    id_venda INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade DECIMAL(10, 3) NOT NULL,
    preco_unitario_praticado DECIMAL(10, 2) NOT NULL,
    desconto DECIMAL(10, 2) DEFAULT 0,
    
    CONSTRAINT FK_ItemVenda_Venda 
        FOREIGN KEY (id_venda) 
        REFERENCES Venda(id_venda),
        
    CONSTRAINT FK_ItemVenda_Produto 
        FOREIGN KEY (id_produto) 
        REFERENCES Produto(id_produto)
);
GO

-- 9. Tabela Transacao_Financeira (Para Fluxo de Caixa e Contas)
CREATE TABLE Transacao_Financeira (
    id_transacao INT PRIMARY KEY IDENTITY(1,1),
    id_supermercado INT NOT NULL,
    tipo_transacao VARCHAR(10) NOT NULL CHECK (tipo_transacao IN ('Receita', 'Despesa')),
    descricao NVARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_vencimento DATE,
    data_pagamento_recebimento DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Pendente', 'Pago', 'Recebido', 'Cancelado')),
    categoria VARCHAR(50), -- Ex: 'Aluguel', 'Salário', 'Vendas PDV'
    
    CONSTRAINT FK_Transacao_Supermercado 
        FOREIGN KEY (id_supermercado) 
        REFERENCES Supermercado(id_supermercado)
);
GO

-- 10. Tabela Plano
CREATE TABLE Plano (
    id_plano INT PRIMARY KEY IDENTITY(1,1),
    nome_plano NVARCHAR(50) NOT NULL,
    valor_mensal DECIMAL(10, 2) NOT NULL,
    descricao NVARCHAR(MAX),
    limite_usuarios INT,
    limite_produtos INT,
    e_ativo BIT DEFAULT 1 
);
GO

-- 11. Tabela Assinatura (Contrato de Plano)
CREATE TABLE Assinatura (
    id_assinatura INT PRIMARY KEY IDENTITY(1,1),
    id_supermercado INT NOT NULL UNIQUE,
    id_plano INT NOT NULL,
    
    data_inicio_vigencia DATE NOT NULL, 
    data_proximo_vencimento DATE NOT NULL,
    data_cancelamento DATE NULL,
    
    status_assinatura VARCHAR(20) NOT NULL CHECK (status_assinatura IN ('Ativa', 'Trial', 'Inadimplente', 'Cancelada', 'Bloqueada')),
    
    CONSTRAINT FK_Assinatura_Supermercado 
        FOREIGN KEY (id_supermercado) 
        REFERENCES Supermercado(id_supermercado),
        
    CONSTRAINT FK_Assinatura_Plano 
        FOREIGN KEY (id_plano) 
        REFERENCES Plano(id_plano)
);
GO

-- 12. Tabela Fatura (Cobrança do Serviço)
CREATE TABLE Fatura (
    id_fatura INT PRIMARY KEY IDENTITY(1,1),
    id_supermercado INT NOT NULL,
    id_assinatura INT NOT NULL,
    
    valor DECIMAL(10, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE NULL,
    status_fatura VARCHAR(20) NOT NULL CHECK (status_fatura IN ('Aberta', 'Paga', 'Vencida', 'Cancelada')),
    
    CONSTRAINT FK_Fatura_Supermercado 
        FOREIGN KEY (id_supermercado) 
        REFERENCES Supermercado(id_supermercado),
        
    CONSTRAINT FK_Fatura_Assinatura 
        FOREIGN KEY (id_assinatura) 
        REFERENCES Assinatura(id_assinatura)
);
GO


-- Tabela de Auditoria
CREATE TABLE Log_Auditoria (
    id_log INT PRIMARY KEY IDENTITY(1,1),
    id_usuario INT,
    id_supermercado INT NULL,
    
    nome_tabela NVARCHAR(100) NOT NULL,
    id_registro_alterado INT NOT NULL, 
    tipo_operacao CHAR(1) NOT NULL CHECK (tipo_operacao IN ('I', 'U', 'D')), 

    data_hora_acao DATETIME DEFAULT GETDATE(),
    
    dados_antigos NVARCHAR(MAX),
    dados_novos NVARCHAR(MAX), 
    
    CONSTRAINT FK_Log_Usuario 
        FOREIGN KEY (id_usuario) 
        REFERENCES Usuario(id_usuario),
        
	  CONSTRAINT FK_Usuario_Supermercado 
        FOREIGN KEY (id_supermercado) 
        REFERENCES Supermercado(id_supermercado)
);
GO