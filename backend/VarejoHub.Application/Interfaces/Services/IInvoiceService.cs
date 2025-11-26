using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Services
{
    public interface IInvoiceService
    {
        Task AddAsync(Invoice invoice);
        Task UpdateAsync(Invoice invoice);
        Task DeleteAsync(int id);
        Task<Invoice?> GetByIdAsync(int id);
        Task<IEnumerable<Invoice>> GetBySubscriptionIdAsync(int subscriptionId);
        Task<IEnumerable<Invoice>> GetBySupermarketIdAsync(int supermarketId);
        Task<IEnumerable<Invoice>> GetByStatusAsync(string status);
        Task<IEnumerable<Invoice>> GetOverdueAsync();
    }
}
