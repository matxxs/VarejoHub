using Microsoft.EntityFrameworkCore;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Domain.Entities;
using VarejoHub.Infrastructure.Data;
using VarejoHub.Infrastructure.Repositories;

public class SaleRepository : Repository<Sale>, ISaleRepository
{
    public SaleRepository(VarejoHubDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Sale>> GetSalesBySupermarketIdAsync(int supermarketId, DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Where(v => v.IdSupermercado == supermarketId && v.DataHora >= startDate && v.DataHora <= endDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Sale>> GetSalesByCashierUserAsync(int userId)
    {
        return await _dbSet.Where(v => v.IdUsuarioCaixa == userId).ToListAsync();
    }

    public async Task<IEnumerable<Sale>> GetSalesByClientAsync(int clientId)
    {
        return await _dbSet.Where(v => v.IdCliente == clientId).ToListAsync();
    }


    public async Task<decimal> GetTotalSalesValueAsync(int supermarketId, DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Where(v => v.IdSupermercado == supermarketId && 
                v.DataHora >= startDate &&
                        v.DataHora <= endDate)
            .SumAsync(m => m.ValorTotal); ;
    }
}