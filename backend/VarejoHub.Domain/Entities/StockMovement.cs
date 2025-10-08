using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VarejoHub.Domain.Entities
{
    [Table("Movimentacao_Estoque")]
    public class StockMovement
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdMovimentacao { get; set; }

        [Required]
        public int IdSupermercado { get; set; }

        [Required]
        public int IdProduto { get; set; }

        [Required]
        [MaxLength(20)]
        public string TipoMovimentacao { get; set; } // CHECK: 'Entrada', 'Saida_Venda', 'Perda', 'Vencimento', 'Ajuste'

        [Required]
        [Column(TypeName = "decimal(10, 3)")]
        public decimal Quantidade { get; set; }

        public DateTime DataHora { get; set; } = DateTime.Now;

        [MaxLength(50)]
        public string? NotaFiscalRef { get; set; }

        // Propriedade de Navegação
        [ForeignKey("IdProduto")]
        public Product Produto { get; set; }
    }
}