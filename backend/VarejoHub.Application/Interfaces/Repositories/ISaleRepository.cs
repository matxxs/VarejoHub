using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Repositories;

public interface ISaleRepository
{
    // CRUD Operations
    Task<Sale?> GetByIdAsync(int id);
    Task<IEnumerable<Sale>> GetSalesBySupermarketIdAsync(int supermarketId, DateTime startDate, DateTime endDate);
    Task AddAsync(Sale sale);
    // Sales are usually immutable after creation, so Update/Delete are rare

    // Specific Queries
    Task<IEnumerable<Sale>> GetSalesByCashierUserAsync(int userId);
    Task<IEnumerable<Sale>> GetSalesByClientAsync(int clientId);
    Task<decimal> GetTotalSalesValueAsync(int supermarketId, DateTime startDate, DateTime endDate);
}
