using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VarejoHub.Domain.Entities
{
    [Table("Item_Venda")]
    public class SaleItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdItemVenda { get; set; }

        [Required]
        public int IdVenda { get; set; }

        [Required]
        public int IdProduto { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 3)")]
        public decimal Quantidade { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal PrecoUnitarioPraticado { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal Desconto { get; set; } = 0;

        // Propriedades de Navegação
        [ForeignKey("IdVenda")]
        public Sale Venda { get; set; }

        [ForeignKey("IdProduto")]
        public Product Produto { get; set; }
    }
}