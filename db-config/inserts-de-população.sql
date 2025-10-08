-- 1. Inserção de Planos
INSERT INTO Plano (nome_plano, valor_mensal, descricao, limite_usuarios, limite_produtos, e_ativo) VALUES
('Básico', 199.90, 'Essencial para pequenos supermercados. Inclui PDV e Controle de Estoque.', 5, 2000, 1),
('Profissional', 399.90, 'Completo. Inclui Finaneiro, Fidelidade e Relatórios Avançados.', 15, 10000, 1),
('Premium', 599.90, 'Tudo ilimitado e suporte prioritário 24/7.', 999, 99999, 1);
GO

-- 2. Inserção de Supermercados
INSERT INTO Supermercado (nome_fantasia, cnpj, data_adesao, data_inicio_trial, status) VALUES
('Super Mais Barato', '01234567890123', GETDATE(), DATEADD(day, -7, GETDATE()), 'Trial'), 
('Hortifruti da Vovó', '98765432109876', DATEADD(month, -3, GETDATE()), NULL, 'Ativo');
GO

-- 3. Inserção da Assinatura para o cliente ativo
DECLARE @Supermercado2 INT = (SELECT id_supermercado FROM Supermercado WHERE nome_fantasia = 'Hortifruti da Vovó');
DECLARE @PlanoPro INT = (SELECT id_plano FROM Plano WHERE nome_plano = 'Profissional');

INSERT INTO Assinatura (id_supermercado, id_plano, data_inicio_vigencia, data_proximo_vencimento, status_assinatura) VALUES
(@Supermercado2, @PlanoPro, DATEADD(month, -3, GETDATE()), DATEADD(day, 30, GETDATE()), 'Ativa');
GO

-- 4. Inserção de Usuários
DECLARE @Supermercado1 INT = (SELECT id_supermercado FROM Supermercado WHERE nome_fantasia = 'Super Mais Barato');
DECLARE @Supermercado2 INT = (SELECT id_supermercado FROM Supermercado WHERE nome_fantasia = 'Hortifruti da Vovó');

INSERT INTO Usuario (id_supermercado, email, nome, nivel_acesso, confirmado, e_global_admin) VALUES
(NULL, 'master@varejohub.com', 'Dev Master', 'Administrador', 1, 1), -- Superusuario Global (e_global_admin = 1, id_supermercado = NULL)

(@Supermercado1, 'adm.supermais@teste.com', 'Ana Paula Silva', 'Administrador', 1, 0), -- Admin do Super Mais Barato
(@Supermercado1, 'caixa1.supermais@teste.com', 'Pedro Santos', 'Caixa', 1, 0), -- Funcionário Caixa

(@Supermercado2, 'joao.hortifruti@ativo.com', 'João Matos', 'Administrador', 1, 0); -- Admin do Hortifruti da Vovó
GO