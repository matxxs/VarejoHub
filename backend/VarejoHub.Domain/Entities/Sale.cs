using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VarejoHub.Domain.Entities
{
    [Table("Venda")]
    public class Sale
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdVenda { get; set; }

        [Required]
        public int IdSupermercado { get; set; }

        // O caixa pode ser Null se a venda for feita por outro meio (ex: e-commerce)
        public int? IdUsuarioCaixa { get; set; }

        // O cliente não é obrigatório para todas as vendas
        public int? IdCliente { get; set; }

        public DateTime DataHora { get; set; } = DateTime.Now;

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal ValorTotal { get; set; }

        [MaxLength(50)]
        public string? CupomFiscalNumero { get; set; }

        // Propriedades de Navegação
        [ForeignKey("IdSupermercado")]
        public Supermarket Supermercado { get; set; }

        [ForeignKey("IdUsuarioCaixa")]
        public User? UsuarioCaixa { get; set; }

        [ForeignKey("IdCliente")]
        public Client? Cliente { get; set; }

        public ICollection<SaleItem> Itens { get; set; }
    }
}