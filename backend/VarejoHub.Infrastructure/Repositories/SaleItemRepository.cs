using Microsoft.EntityFrameworkCore;
using System.Linq;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Domain.Entities;
using VarejoHub.Infrastructure.Data;
using VarejoHub.Infrastructure.Repositories;

public class SaleItemRepository : Repository<SaleItem>, ISaleItemRepository
{
    public SaleItemRepository(VarejoHubDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<SaleItem>> GetItemsBySaleIdAsync(int saleId)
    {
        return await _dbSet.Where(item => item.IdVenda == saleId).ToListAsync();
    }

    public async Task<IEnumerable<SaleItem>> GetItemsSoldByProductAsync(int productId, DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Include(item => item.Venda) // Inclui a venda para filtrar por data/supermercado se necessário
            .Where(item => item.IdProduto == productId && item.Venda.DataHora >= startDate && item.Venda.DataHora <= endDate)
            .ToListAsync();
    }
}