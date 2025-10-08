using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VarejoHub.Domain.Entities
{
    [Table("Produto")]
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdProduto { get; set; }

        [Required]
        public int IdSupermercado { get; set; }

        [MaxLength(20)]
        public string? CodigoBarras { get; set; }

        [Required]
        [MaxLength(150)]
        public string Nome { get; set; }

        [Required]
        [MaxLength(10)]
        public string UnidadeMedida { get; set; } // CHECK: 'UN', 'KG', 'L', 'PCT'

        [Required]
        [Column(TypeName = "decimal(10, 3)")]
        public decimal EstoqueAtual { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal? PrecoCusto { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal PrecoVenda { get; set; }

        public int AlertaBaixoEstoque { get; set; } = 5;

        public DateTime DataCadastro { get; set; } = DateTime.Now;

        // Propriedades de Navegação
        [ForeignKey("IdSupermercado")]
        public Supermarket Supermercado { get; set; }

        public ICollection<StockMovement> Movimentacoes { get; set; }
        public ICollection<SaleItem> ItensVenda { get; set; }
    }
}