using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VarejoHub.Domain.Entities
{
    [Table("Fatura")]
    public class Invoice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdFatura { get; set; }

        [Required]
        public int IdSupermercado { get; set; }

        [Required]
        public int IdAssinatura { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Valor { get; set; }

        [Required]
        public DateOnly DataVencimento { get; set; }

        public DateOnly? DataPagamento { get; set; }

        [Required]
        [MaxLength(20)]
        public string StatusFatura { get; set; } // CHECK: 'Aberta', 'Paga', 'Vencida', 'Cancelada'

        // Propriedades de Navegação
        [ForeignKey("IdSupermercado")]
        public Supermarket Supermercado { get; set; }

        [ForeignKey("IdAssinatura")]
        public Subscription Assinatura { get; set; }
    }
}