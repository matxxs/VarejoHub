using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VarejoHub.Domain.Entities
{
    [Table("Plano")]
    public class Plan
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdPlano { get; set; }

        [Required]
        [MaxLength(50)]
        public string NomePlano { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal ValorMensal { get; set; }

        [MaxLength(255)]
        public string? Descricao { get; set; }

        public int? LimiteUsuarios { get; set; }

        public int? LimiteProdutos { get; set; }

        public bool EAtivo { get; set; } = true;

        [Required]
        public bool PossuiPDV { get; set; } = false;

        [Required]
        public bool PossuiControleEstoque { get; set; } = false;

        [Required]
        public bool PossuiFinanceiro { get; set; } = false;

        [Required]
        public bool PossuiFidelidade { get; set; } = false;

        [Required]
        public bool PossuiRelatoriosAvancados { get; set; } = false;

        [Required]
        public bool PossuiSuportePrioritario { get; set; } = false;

        public ICollection<Subscription> Assinaturas { get; set; }
    }
}