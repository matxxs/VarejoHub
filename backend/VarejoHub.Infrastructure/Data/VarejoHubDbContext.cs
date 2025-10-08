using Microsoft.EntityFrameworkCore;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Infrastructure.Data
{
    public class VarejoHubDbContext : DbContext
    {
        public VarejoHubDbContext(DbContextOptions<VarejoHubDbContext> options) : base(options)
        {
        }
        public DbSet<Supermarket> Supermercados { get; set; }
        public DbSet<User> Usuarios { get; set; }
        public DbSet<Product> Produtos { get; set; }
        public DbSet<StockMovement> MovimentacoesEstoque { get; set; }
        public DbSet<Supplier> Fornecedores { get; set; }
        public DbSet<Client> Clientes { get; set; }
        public DbSet<Sale> Vendas { get; set; }
        public DbSet<SaleItem> ItensVenda { get; set; }
        public DbSet<FinancialTransaction> TransacoesFinanceiras { get; set; }
        public DbSet<Plan> Planos { get; set; }
        public DbSet<Subscription> Assinaturas { get; set; }
        public DbSet<Invoice> Faturas { get; set; }
        public DbSet<LogAuditoria> LogsAuditoria { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Supermarket>().HasIndex(s => s.Cnpj).IsUnique();
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Supplier>().HasIndex(f => f.Cnpj).IsUnique();
            modelBuilder.Entity<Client>().HasIndex(c => c.Cpf).IsUnique();
            modelBuilder.Entity<Subscription>().HasIndex(a => a.IdSupermercado).IsUnique();

            modelBuilder.Entity<Supermarket>()
                .HasOne(s => s.Assinatura)
                .WithOne(a => a.Supermercado)
                .HasForeignKey<Subscription>(a => a.IdSupermercado)
                .IsRequired(); 

            modelBuilder.Entity<Invoice>()
                .HasOne(f => f.Supermercado)
                .WithMany(s => s.Faturas)
                .HasForeignKey(f => f.IdSupermercado)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SaleItem>()
                .HasOne(iv => iv.Produto)
                .WithMany(p => p.ItensVenda)
                .HasForeignKey(iv => iv.IdProduto)
                .OnDelete(DeleteBehavior.Restrict);


            base.OnModelCreating(modelBuilder);
        }

    }
}