using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VarejoHub.Domain.Entities
{
    [Table("Fornecedor")]
    public class Supplier
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdFornecedor { get; set; }

        [Required]
        public int IdSupermercado { get; set; }

        [Required]
        [MaxLength(100)]
        public string NomeFantasia { get; set; }

        [MaxLength(14)]
        public string? Cnpj { get; set; } // UNIQUE (Pode ser null se for MEI sem CNPJ, mas Unique se não for null)

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(20)]
        public string? Telefone { get; set; }

        // Propriedade de Navegação
        [ForeignKey("IdSupermercado")]
        public Supermarket Supermercado { get; set; }
    }
}