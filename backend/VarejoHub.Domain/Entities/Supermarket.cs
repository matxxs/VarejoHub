using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VarejoHub.Domain.Entities
{
    [Table("Supermercado")]
    public class Supermarket
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdSupermercado { get; set; }

        [Required]
        [MaxLength(100)]
        public string NomeFantasia { get; set; }

        [Required]
        [MaxLength(100)]
        public string RazaoSocial { get; set; }

        [Required]
        [MaxLength(14)]
        public string Cnpj { get; set; }

        public DateTime DataAdesao { get; set; } = DateTime.Now;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } // CHECK: 'Ativo', 'Suspenso', 'Trial'

        public DateOnly? DataInicioTrial { get; set; }

        // Propriedades de Navegação (Coleções)
        public ICollection<User> Usuarios { get; set; }
        public ICollection<Product> Produtos { get; set; }
        public ICollection<Supplier> Fornecedores { get; set; }
        public ICollection<Client> Clientes { get; set; }
        public ICollection<Sale> Vendas { get; set; }
        public Subscription Assinatura { get; set; } // 1 para 1
        public ICollection<Invoice> Faturas { get; set; }
    }
}