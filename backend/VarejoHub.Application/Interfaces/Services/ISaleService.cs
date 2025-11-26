using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Services
{
    public interface ISaleService
    {
        Task AddAsync(Sale sale);
        Task UpdateAsync(Sale sale);
        Task DeleteAsync(int id);
        Task<Sale?> GetByIdAsync(int id);
        Task<IEnumerable<Sale>> GetAllBySupermarketIdAsync(int supermarketId);
        Task<IEnumerable<Sale>> GetByDateRangeAsync(int supermarketId, DateTime startDate, DateTime endDate);
        Task<IEnumerable<Sale>> GetByClientIdAsync(int clientId);
    }
}
