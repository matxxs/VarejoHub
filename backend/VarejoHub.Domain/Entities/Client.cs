using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VarejoHub.Domain.Entities
{
    [Table("Cliente")]
    public class Client
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdCliente { get; set; }

        [Required]
        public int IdSupermercado { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nome { get; set; }

        [MaxLength(11)]
        public string? Cpf { get; set; } // UNIQUE (Pode ser null, mas Unique se não for null)

        [MaxLength(100)]
        public string? Email { get; set; }

        public int PontosFidelidade { get; set; } = 0;

        // Propriedade de Navegação
        [ForeignKey("IdSupermercado")]
        public Supermarket Supermercado { get; set; }

        public ICollection<Sale> Compras { get; set; }
    }
}