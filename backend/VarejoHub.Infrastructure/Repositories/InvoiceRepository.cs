using Microsoft.EntityFrameworkCore;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Domain.Entities;
using VarejoHub.Infrastructure.Data;
using VarejoHub.Infrastructure.Repositories;

public class InvoiceRepository : Repository<Invoice>, IInvoiceRepository
{
    public InvoiceRepository(VarejoHubDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Invoice>> GetAllBySupermarketIdAsync(int supermarketId)
    {
        return await _dbSet.Where(f => f.IdSupermercado == supermarketId).ToListAsync();
    }

    public async Task<IEnumerable<Invoice>> GetBySupermarketIdAndStatusAsync(int supermarketId, string status)
    {
        return await _dbSet
            .Where(f => f.IdSupermercado == supermarketId && f.StatusFatura == status)
            .ToListAsync();
    }

    public async Task<IEnumerable<Invoice>> GetOverdueInvoicesAsync(DateOnly currentDate)
    {
        return await _dbSet
            .Where(f => f.DataVencimento < currentDate && f.StatusFatura == "Aberta")
            .ToListAsync();
    }

    public async Task<IEnumerable<Invoice>> GetInvoicesBySubscriptionIdAsync(int subscriptionId)
    {
        return await _dbSet.Where(f => f.IdAssinatura == subscriptionId).ToListAsync();
    }
}