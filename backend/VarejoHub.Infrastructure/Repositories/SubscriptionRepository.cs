using Microsoft.EntityFrameworkCore;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Domain.Entities;
using VarejoHub.Infrastructure.Data;
using VarejoHub.Infrastructure.Repositories;

public class SubscriptionRepository : Repository<Subscription>, ISubscriptionRepository
{
    public SubscriptionRepository(VarejoHubDbContext context) : base(context)
    {
    }

    public async Task<Subscription?> GetBySupermarketIdAsync(int supermarketId)
    {
        return await _dbSet.SingleOrDefaultAsync(a => a.IdSupermercado == supermarketId);
    }

    public async Task<IEnumerable<Subscription>> GetByStatusAsync(string status)
    {
        return await _dbSet.Where(a => a.StatusAssinatura == status).ToListAsync();
    }

    public async Task<IEnumerable<Subscription>> GetExpiringSubscriptionsAsync(DateOnly dateThreshold)
    {
        return await _dbSet
            .Where(a => a.StatusAssinatura == "Ativa" && a.DataProximoVencimento <= dateThreshold)
            .ToListAsync();
    }

    public async Task<int> CountSubscriptionsByPlanAsync(int planId)
    {
        return await _dbSet.Where(w => w.IdPlano == planId).CountAsync();
    }

    public async Task<Subscription?> GetBySupermarketIdWithPlanAsync(int supermarketId)
    {
        return await _context.Assinaturas
                             .Include(s => s.Plano) 
                             .AsNoTracking()
                             .FirstOrDefaultAsync(s => s.IdSupermercado == supermarketId);
    }
}