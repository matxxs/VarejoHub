using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VarejoHub.Domain.Entities
{
    [Table("Log_Auditoria")]
    public class LogAuditoria
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdLog { get; set; }

        public int? IdUsuario { get; set; }
        public int? IdSupermercado { get; set; }

        [Required]
        [MaxLength(100)]
        public string NomeTabela { get; set; }

        [Required]
        public int IdRegistroAlterado { get; set; }

        [Required]
        [MaxLength(1)]
        public string TipoOperacao { get; set; } // CHECK: 'I' (Insert), 'U' (Update), 'D' (Delete)

        public DateTime DataHoraAcao { get; set; } = DateTime.Now;

        [Column(TypeName = "nvarchar(max)")]
        public string? DadosAntigos { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? DadosNovos { get; set; }

        // Propriedades de Navegação
        [ForeignKey("IdUsuario")]
        public User? Usuario { get; set; }

        [ForeignKey("IdSupermercado")]
        public Supermarket? Supermercado { get; set; }
    }
}