using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Domain.Entities;
using VarejoHub.Infrastructure.Data;
using VarejoHub.Infrastructure.Repositories;

public class StockMovementRepository : Repository<StockMovement>, IStockMovementRepository
{
    public StockMovementRepository(VarejoHubDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<StockMovement>> GetByProductIdAsync(int productId)
    {
        return await _dbSet.Where(m => m.IdProduto == productId).ToListAsync();
    }

    public async Task<IEnumerable<StockMovement>> GetMovementsByTypeAsync(int supermarketId, string movementType)
    {
        return await _dbSet
            .Where(m => m.IdSupermercado == supermarketId && m.TipoMovimentacao == movementType)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalQuantityMovedAsync(int productId, string movementType, DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Where(m => m.IdProduto == productId &&
                        m.TipoMovimentacao == movementType &&
                        m.DataHora >= startDate &&
                        m.DataHora <= endDate)
            .SumAsync(m => m.Quantidade);
    }
}