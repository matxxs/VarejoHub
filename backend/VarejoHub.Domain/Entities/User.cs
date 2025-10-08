using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VarejoHub.Domain.Entities
{
    [Table("Usuario")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdUsuario { get; set; }

        // Chave estrangeira, pode ser NULL se for Global Admin
        public int? IdSupermercado { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; } // UNIQUE

        [Required]
        [MaxLength(100)]
        public string Nome { get; set; }

        [Required]
        [MaxLength(20)]
        public string NivelAcesso { get; set; } // CHECK: 'Administrador', 'Gerente', 'Caixa', 'Financeiro'

        [MaxLength(60)]
        public string? TokenAcessoTemporario { get; set; }

        public DateTime? DataExpiracaoToken { get; set; }

        public bool Confirmado { get; set; } = false;

        [Required]
        public bool EGlobalAdmin { get; set; } = false;

        // Propriedade de Navegação
        [ForeignKey("IdSupermercado")]
        public Supermarket? Supermercado { get; set; }

        public ICollection<Sale> VendasRealizadas { get; set; }
        public ICollection<LogAuditoria> LogsAuditoria { get; set; }
    }
}