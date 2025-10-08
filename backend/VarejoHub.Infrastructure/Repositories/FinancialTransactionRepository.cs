using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Domain.Entities;
using VarejoHub.Infrastructure.Data;
using VarejoHub.Infrastructure.Repositories;

public class FinancialTransactionRepository : Repository<FinancialTransaction>, IFinancialTransactionRepository
{
    public FinancialTransactionRepository(VarejoHubDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<FinancialTransaction>> GetAllBySupermarketIdAsync(int supermarketId)
    {
        return await _dbSet.Where(t => t.IdSupermercado == supermarketId).ToListAsync();
    }

    public async Task<IEnumerable<FinancialTransaction>> GetByTransactionTypeAsync(int supermarketId, string type)
    {
        return await _dbSet
            .Where(t => t.IdSupermercado == supermarketId && t.TipoTransacao == type)
            .ToListAsync();
    }

    public async Task<IEnumerable<FinancialTransaction>> GetByStatusAsync(int supermarketId, string status)
    {
        return await _dbSet
            .Where(t => t.IdSupermercado == supermarketId && t.Status == status)
            .ToListAsync();
    }

    public async Task<IEnumerable<FinancialTransaction>> GetDueTransactionsAsync(int supermarketId, DateOnly dueDate)
    {
        return await _dbSet
            .Where(t => t.IdSupermercado == supermarketId &&
                        t.DataVencimento <= dueDate &&
                        t.Status == "Pendente")
            .ToListAsync();
    }
}