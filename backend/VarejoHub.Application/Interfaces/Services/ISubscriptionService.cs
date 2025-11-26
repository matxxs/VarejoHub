using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Services
{
    public interface ISubscriptionService
    {
        Task AddAsync(Subscription subscription);
        Task UpdateAsync(Subscription subscription);
        Task DeleteAsync(int id);
        Task<Subscription?> GetByIdAsync(int id);
        Task<Subscription?> GetBySupermarketIdAsync(int supermarketId);
        Task<IEnumerable<Subscription>> GetAllAsync();
        Task<IEnumerable<Subscription>> GetByStatusAsync(string status);
    }
}
