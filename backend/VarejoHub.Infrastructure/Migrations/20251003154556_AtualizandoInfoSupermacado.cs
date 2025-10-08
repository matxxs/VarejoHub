using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VarejoHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AtualizandoInfoSupermacado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RazaoSocial",
                table: "Supermercado",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RazaoSocial",
                table: "Supermercado");
        }
    }
}
