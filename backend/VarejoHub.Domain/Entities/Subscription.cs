using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VarejoHub.Domain.Entities
{
    [Table("Assinatura")]
    public class Subscription
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdAssinatura { get; set; }

        [Required]
        public int IdSupermercado { get; set; } // UNIQUE

        [Required]
        public int IdPlano { get; set; }

        [Required]
        public DateOnly DataInicioVigencia { get; set; }

        [Required]
        public DateOnly DataProximoVencimento { get; set; }

        public DateOnly? DataCancelamento { get; set; }

        [Required]
        [MaxLength(20)]
        public string StatusAssinatura { get; set; } // CHECK: 'Ativa', 'Trial', 'Inadimplente', 'Cancelada', 'Bloqueada'

        // Propriedades de Navegação
        [ForeignKey("IdSupermercado")]
        public Supermarket Supermercado { get; set; }

        [ForeignKey("IdPlano")]
        public Plan Plano { get; set; }

        public ICollection<Invoice> Faturas { get; set; }
    }
}