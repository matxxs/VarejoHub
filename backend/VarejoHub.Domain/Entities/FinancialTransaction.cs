using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VarejoHub.Domain.Entities
{
    [Table("Transacao_Financeira")]
    public class FinancialTransaction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdTransacao { get; set; }

        [Required]
        public int IdSupermercado { get; set; }

        [Required]
        [MaxLength(10)]
        public string TipoTransacao { get; set; } // CHECK: 'Receita', 'Despesa'

        [Required]
        [MaxLength(255)]
        public string Descricao { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Valor { get; set; }

        public DateOnly? DataVencimento { get; set; }

        public DateOnly? DataPagamentoRecebimento { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } // CHECK: 'Pendente', 'Pago', 'Recebido', 'Cancelado'

        [MaxLength(50)]
        public string? Categoria { get; set; }

        // Propriedade de Navegação
        [ForeignKey("IdSupermercado")]
        public Supermarket Supermercado { get; set; }
    }
}