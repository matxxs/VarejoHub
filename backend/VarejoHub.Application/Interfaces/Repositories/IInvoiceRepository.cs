using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Repositories
{
    public interface IInvoiceRepository
    {
        // CRUD Operations
        Task<Invoice?> GetByIdAsync(int id);
        Task<IEnumerable<Invoice>> GetAllBySupermarketIdAsync(int supermarketId);
        Task AddAsync(Invoice invoice);
        Task UpdateAsync(Invoice invoice);

        // Specific Queries
        Task<IEnumerable<Invoice>> GetBySupermarketIdAndStatusAsync(int supermarketId, string status);
        Task<IEnumerable<Invoice>> GetOverdueInvoicesAsync(DateOnly currentDate);
        Task<IEnumerable<Invoice>> GetInvoicesBySubscriptionIdAsync(int subscriptionId);
    }
}
