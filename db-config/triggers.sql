CREATE TRIGGER trg_Produto_Auditoria
ON Produto
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @UsuarioID INT = 1; 
    DECLARE @SupermercadoID INT;
    DECLARE @TipoOperacao CHAR(1);
    DECLARE @DadosAntigos NVARCHAR(MAX);
    DECLARE @DadosNovos NVARCHAR(MAX);

    IF EXISTS(SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted)
    BEGIN
        SET @TipoOperacao = 'I';
        
        SELECT @SupermercadoID = id_supermercado, @DadosNovos = (SELECT * FROM inserted FOR JSON AUTO) FROM inserted;
        
        INSERT INTO Log_Auditoria (id_usuario, id_supermercado, nome_tabela, id_registro_alterado, tipo_operacao, dados_novos)
        SELECT @UsuarioID, @SupermercadoID, 'Produto', id_produto, @TipoOperacao, @DadosNovos
        FROM inserted;
    END

    IF EXISTS(SELECT * FROM inserted) AND EXISTS(SELECT * FROM deleted)
    BEGIN
        SET @TipoOperacao = 'U';
        
        SELECT @SupermercadoID = d.id_supermercado, @DadosAntigos = (SELECT * FROM deleted FOR JSON AUTO), @DadosNovos = (SELECT * FROM inserted FOR JSON AUTO)
        FROM deleted d
        INNER JOIN inserted i ON d.id_produto = i.id_produto;

        INSERT INTO Log_Auditoria (id_usuario, id_supermercado, nome_tabela, id_registro_alterado, tipo_operacao, dados_antigos, dados_novos)
        SELECT @UsuarioID, @SupermercadoID, 'Produto', i.id_produto, @TipoOperacao, @DadosAntigos, @DadosNovos
        FROM inserted i;
    END

    IF NOT EXISTS(SELECT * FROM inserted) AND EXISTS(SELECT * FROM deleted)
    BEGIN
        SET @TipoOperacao = 'D';
        
        SELECT @SupermercadoID = id_supermercado, @DadosAntigos = (SELECT * FROM deleted FOR JSON AUTO) FROM deleted;

        INSERT INTO Log_Auditoria (id_usuario, id_supermercado, nome_tabela, id_registro_alterado, tipo_operacao, dados_antigos)
        SELECT @UsuarioID, @SupermercadoID, 'Produto', id_produto, @TipoOperacao, @DadosAntigos
        FROM deleted;
    END
END
GO