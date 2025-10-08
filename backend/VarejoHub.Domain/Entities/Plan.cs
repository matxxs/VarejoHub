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

        [Column(TypeName = "nvarchar(max)")]
        public string? Descricao { get; set; }

        public int? LimiteUsuarios { get; set; }

        public int? LimiteProdutos { get; set; }

        public bool EAtivo { get; set; } = true;

        public ICollection<Subscription> Assinaturas { get; set; }
    }
}