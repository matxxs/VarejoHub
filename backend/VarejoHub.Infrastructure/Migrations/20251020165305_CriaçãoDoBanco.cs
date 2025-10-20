using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VarejoHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CriaçãoDoBanco : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Plano",
                columns: table => new
                {
                    IdPlano = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NomePlano = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ValorMensal = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    LimiteUsuarios = table.Column<int>(type: "int", nullable: true),
                    LimiteProdutos = table.Column<int>(type: "int", nullable: true),
                    EAtivo = table.Column<bool>(type: "bit", nullable: false),
                    PossuiPDV = table.Column<bool>(type: "bit", nullable: false),
                    PossuiControleEstoque = table.Column<bool>(type: "bit", nullable: false),
                    PossuiFinanceiro = table.Column<bool>(type: "bit", nullable: false),
                    PossuiFidelidade = table.Column<bool>(type: "bit", nullable: false),
                    PossuiRelatoriosAvancados = table.Column<bool>(type: "bit", nullable: false),
                    PossuiSuportePrioritario = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plano", x => x.IdPlano);
                });

            migrationBuilder.CreateTable(
                name: "Supermercado",
                columns: table => new
                {
                    IdSupermercado = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NomeFantasia = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RazaoSocial = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Cnpj = table.Column<string>(type: "nvarchar(14)", maxLength: 14, nullable: false),
                    DataAdesao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supermercado", x => x.IdSupermercado);
                });

            migrationBuilder.CreateTable(
                name: "Assinatura",
                columns: table => new
                {
                    IdAssinatura = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdSupermercado = table.Column<int>(type: "int", nullable: false),
                    IdPlano = table.Column<int>(type: "int", nullable: false),
                    DataInicioVigencia = table.Column<DateOnly>(type: "date", nullable: false),
                    DataProximoVencimento = table.Column<DateOnly>(type: "date", nullable: false),
                    DataCancelamento = table.Column<DateOnly>(type: "date", nullable: true),
                    StatusAssinatura = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assinatura", x => x.IdAssinatura);
                    table.ForeignKey(
                        name: "FK_Assinatura_Plano_IdPlano",
                        column: x => x.IdPlano,
                        principalTable: "Plano",
                        principalColumn: "IdPlano",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Assinatura_Supermercado_IdSupermercado",
                        column: x => x.IdSupermercado,
                        principalTable: "Supermercado",
                        principalColumn: "IdSupermercado",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Cliente",
                columns: table => new
                {
                    IdCliente = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdSupermercado = table.Column<int>(type: "int", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Cpf = table.Column<string>(type: "nvarchar(11)", maxLength: 11, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PontosFidelidade = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cliente", x => x.IdCliente);
                    table.ForeignKey(
                        name: "FK_Cliente_Supermercado_IdSupermercado",
                        column: x => x.IdSupermercado,
                        principalTable: "Supermercado",
                        principalColumn: "IdSupermercado",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Fornecedor",
                columns: table => new
                {
                    IdFornecedor = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdSupermercado = table.Column<int>(type: "int", nullable: false),
                    NomeFantasia = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Cnpj = table.Column<string>(type: "nvarchar(14)", maxLength: 14, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Telefone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fornecedor", x => x.IdFornecedor);
                    table.ForeignKey(
                        name: "FK_Fornecedor_Supermercado_IdSupermercado",
                        column: x => x.IdSupermercado,
                        principalTable: "Supermercado",
                        principalColumn: "IdSupermercado",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Produto",
                columns: table => new
                {
                    IdProduto = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdSupermercado = table.Column<int>(type: "int", nullable: false),
                    CodigoBarras = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Nome = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    UnidadeMedida = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    EstoqueAtual = table.Column<decimal>(type: "decimal(10,3)", nullable: false),
                    PrecoCusto = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    PrecoVenda = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    AlertaBaixoEstoque = table.Column<int>(type: "int", nullable: false),
                    DataCadastro = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Produto", x => x.IdProduto);
                    table.ForeignKey(
                        name: "FK_Produto_Supermercado_IdSupermercado",
                        column: x => x.IdSupermercado,
                        principalTable: "Supermercado",
                        principalColumn: "IdSupermercado",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Transacao_Financeira",
                columns: table => new
                {
                    IdTransacao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdSupermercado = table.Column<int>(type: "int", nullable: false),
                    TipoTransacao = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    DataVencimento = table.Column<DateOnly>(type: "date", nullable: true),
                    DataPagamentoRecebimento = table.Column<DateOnly>(type: "date", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Categoria = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transacao_Financeira", x => x.IdTransacao);
                    table.ForeignKey(
                        name: "FK_Transacao_Financeira_Supermercado_IdSupermercado",
                        column: x => x.IdSupermercado,
                        principalTable: "Supermercado",
                        principalColumn: "IdSupermercado",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Usuario",
                columns: table => new
                {
                    IdUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdSupermercado = table.Column<int>(type: "int", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NivelAcesso = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TokenAcessoTemporario = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    DataExpiracaoToken = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Confirmado = table.Column<bool>(type: "bit", nullable: false),
                    EGlobalAdmin = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuario", x => x.IdUsuario);
                    table.ForeignKey(
                        name: "FK_Usuario_Supermercado_IdSupermercado",
                        column: x => x.IdSupermercado,
                        principalTable: "Supermercado",
                        principalColumn: "IdSupermercado");
                });

            migrationBuilder.CreateTable(
                name: "Fatura",
                columns: table => new
                {
                    IdFatura = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdSupermercado = table.Column<int>(type: "int", nullable: false),
                    IdAssinatura = table.Column<int>(type: "int", nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    DataVencimento = table.Column<DateOnly>(type: "date", nullable: false),
                    DataPagamento = table.Column<DateOnly>(type: "date", nullable: true),
                    StatusFatura = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fatura", x => x.IdFatura);
                    table.ForeignKey(
                        name: "FK_Fatura_Assinatura_IdAssinatura",
                        column: x => x.IdAssinatura,
                        principalTable: "Assinatura",
                        principalColumn: "IdAssinatura",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Fatura_Supermercado_IdSupermercado",
                        column: x => x.IdSupermercado,
                        principalTable: "Supermercado",
                        principalColumn: "IdSupermercado",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Movimentacao_Estoque",
                columns: table => new
                {
                    IdMovimentacao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdSupermercado = table.Column<int>(type: "int", nullable: false),
                    IdProduto = table.Column<int>(type: "int", nullable: false),
                    TipoMovimentacao = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Quantidade = table.Column<decimal>(type: "decimal(10,3)", nullable: false),
                    DataHora = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NotaFiscalRef = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movimentacao_Estoque", x => x.IdMovimentacao);
                    table.ForeignKey(
                        name: "FK_Movimentacao_Estoque_Produto_IdProduto",
                        column: x => x.IdProduto,
                        principalTable: "Produto",
                        principalColumn: "IdProduto",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Log_Auditoria",
                columns: table => new
                {
                    IdLog = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdUsuario = table.Column<int>(type: "int", nullable: true),
                    IdSupermercado = table.Column<int>(type: "int", nullable: true),
                    NomeTabela = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IdRegistroAlterado = table.Column<int>(type: "int", nullable: false),
                    TipoOperacao = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    DataHoraAcao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DadosAntigos = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DadosNovos = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Log_Auditoria", x => x.IdLog);
                    table.ForeignKey(
                        name: "FK_Log_Auditoria_Supermercado_IdSupermercado",
                        column: x => x.IdSupermercado,
                        principalTable: "Supermercado",
                        principalColumn: "IdSupermercado");
                    table.ForeignKey(
                        name: "FK_Log_Auditoria_Usuario_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "Usuario",
                        principalColumn: "IdUsuario");
                });

            migrationBuilder.CreateTable(
                name: "Venda",
                columns: table => new
                {
                    IdVenda = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdSupermercado = table.Column<int>(type: "int", nullable: false),
                    IdUsuarioCaixa = table.Column<int>(type: "int", nullable: true),
                    IdCliente = table.Column<int>(type: "int", nullable: true),
                    DataHora = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ValorTotal = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    CupomFiscalNumero = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Venda", x => x.IdVenda);
                    table.ForeignKey(
                        name: "FK_Venda_Cliente_IdCliente",
                        column: x => x.IdCliente,
                        principalTable: "Cliente",
                        principalColumn: "IdCliente");
                    table.ForeignKey(
                        name: "FK_Venda_Supermercado_IdSupermercado",
                        column: x => x.IdSupermercado,
                        principalTable: "Supermercado",
                        principalColumn: "IdSupermercado",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Venda_Usuario_IdUsuarioCaixa",
                        column: x => x.IdUsuarioCaixa,
                        principalTable: "Usuario",
                        principalColumn: "IdUsuario");
                });

            migrationBuilder.CreateTable(
                name: "Item_Venda",
                columns: table => new
                {
                    IdItemVenda = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdVenda = table.Column<int>(type: "int", nullable: false),
                    IdProduto = table.Column<int>(type: "int", nullable: false),
                    Quantidade = table.Column<decimal>(type: "decimal(10,3)", nullable: false),
                    PrecoUnitarioPraticado = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Desconto = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Item_Venda", x => x.IdItemVenda);
                    table.ForeignKey(
                        name: "FK_Item_Venda_Produto_IdProduto",
                        column: x => x.IdProduto,
                        principalTable: "Produto",
                        principalColumn: "IdProduto",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Item_Venda_Venda_IdVenda",
                        column: x => x.IdVenda,
                        principalTable: "Venda",
                        principalColumn: "IdVenda",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Assinatura_IdPlano",
                table: "Assinatura",
                column: "IdPlano");

            migrationBuilder.CreateIndex(
                name: "IX_Assinatura_IdSupermercado",
                table: "Assinatura",
                column: "IdSupermercado",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cliente_Cpf",
                table: "Cliente",
                column: "Cpf",
                unique: true,
                filter: "[Cpf] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Cliente_IdSupermercado",
                table: "Cliente",
                column: "IdSupermercado");

            migrationBuilder.CreateIndex(
                name: "IX_Fatura_IdAssinatura",
                table: "Fatura",
                column: "IdAssinatura");

            migrationBuilder.CreateIndex(
                name: "IX_Fatura_IdSupermercado",
                table: "Fatura",
                column: "IdSupermercado");

            migrationBuilder.CreateIndex(
                name: "IX_Fornecedor_Cnpj",
                table: "Fornecedor",
                column: "Cnpj",
                unique: true,
                filter: "[Cnpj] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Fornecedor_IdSupermercado",
                table: "Fornecedor",
                column: "IdSupermercado");

            migrationBuilder.CreateIndex(
                name: "IX_Item_Venda_IdProduto",
                table: "Item_Venda",
                column: "IdProduto");

            migrationBuilder.CreateIndex(
                name: "IX_Item_Venda_IdVenda",
                table: "Item_Venda",
                column: "IdVenda");

            migrationBuilder.CreateIndex(
                name: "IX_Log_Auditoria_IdSupermercado",
                table: "Log_Auditoria",
                column: "IdSupermercado");

            migrationBuilder.CreateIndex(
                name: "IX_Log_Auditoria_IdUsuario",
                table: "Log_Auditoria",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_Movimentacao_Estoque_IdProduto",
                table: "Movimentacao_Estoque",
                column: "IdProduto");

            migrationBuilder.CreateIndex(
                name: "IX_Produto_IdSupermercado",
                table: "Produto",
                column: "IdSupermercado");

            migrationBuilder.CreateIndex(
                name: "IX_Supermercado_Cnpj",
                table: "Supermercado",
                column: "Cnpj",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transacao_Financeira_IdSupermercado",
                table: "Transacao_Financeira",
                column: "IdSupermercado");

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_Email",
                table: "Usuario",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_IdSupermercado",
                table: "Usuario",
                column: "IdSupermercado");

            migrationBuilder.CreateIndex(
                name: "IX_Venda_IdCliente",
                table: "Venda",
                column: "IdCliente");

            migrationBuilder.CreateIndex(
                name: "IX_Venda_IdSupermercado",
                table: "Venda",
                column: "IdSupermercado");

            migrationBuilder.CreateIndex(
                name: "IX_Venda_IdUsuarioCaixa",
                table: "Venda",
                column: "IdUsuarioCaixa");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Fatura");

            migrationBuilder.DropTable(
                name: "Fornecedor");

            migrationBuilder.DropTable(
                name: "Item_Venda");

            migrationBuilder.DropTable(
                name: "Log_Auditoria");

            migrationBuilder.DropTable(
                name: "Movimentacao_Estoque");

            migrationBuilder.DropTable(
                name: "Transacao_Financeira");

            migrationBuilder.DropTable(
                name: "Assinatura");

            migrationBuilder.DropTable(
                name: "Venda");

            migrationBuilder.DropTable(
                name: "Produto");

            migrationBuilder.DropTable(
                name: "Plano");

            migrationBuilder.DropTable(
                name: "Cliente");

            migrationBuilder.DropTable(
                name: "Usuario");

            migrationBuilder.DropTable(
                name: "Supermercado");
        }
    }
}
