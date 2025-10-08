using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Domain.Entities;
using VarejoHub.Infrastructure.Data;
using VarejoHub.Infrastructure.Repositories;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(VarejoHubDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Product>> GetAllBySupermarketIdAsync(int supermarketId)
    {
        return await _dbSet.Where(p => p.IdSupermercado == supermarketId).ToListAsync();
    }

    public async Task<Product?> GetByBarcodeAsync(string barcode, int supermarketId)
    {
        return await _dbSet.FirstOrDefaultAsync(p => p.CodigoBarras == barcode && p.IdSupermercado == supermarketId);
    }

    public async Task<IEnumerable<Product>> GetLowStockAlertsAsync(int supermarketId)
    {
        return await _dbSet
            .Where(p => p.IdSupermercado == supermarketId && p.EstoqueAtual <= p.AlertaBaixoEstoque)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> SearchByNameAsync(string name, int supermarketId)
    {
        return await _dbSet
            .Where(p => p.IdSupermercado == supermarketId && p.Equals(name))
            .ToListAsync();
    }
}