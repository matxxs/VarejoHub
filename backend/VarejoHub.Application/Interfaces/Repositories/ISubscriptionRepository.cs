using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Repositories;

public interface ISubscriptionRepository
{
    // CRUD Operations
    Task<Subscription?> GetByIdAsync(int id);
    Task<Subscription?> GetBySupermarketIdAsync(int supermarketId);
    Task AddAsync(Subscription subscription);
    Task UpdateAsync(Subscription subscription);
   

    // Specific Queries
    Task<IEnumerable<Subscription>> GetByStatusAsync(string status);
    Task<IEnumerable<Subscription>> GetExpiringSubscriptionsAsync(DateOnly dateThreshold);
    Task<int> CountSubscriptionsByPlanAsync(int planId);
}
