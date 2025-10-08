using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Repositories;

public interface ISaleItemRepository
{
    // CRUD Operations
    Task<SaleItem?> GetByIdAsync(int id);
    Task<IEnumerable<SaleItem>> GetItemsBySaleIdAsync(int saleId);
    Task AddAsync(SaleItem item);

    // Specific Queries
    Task<IEnumerable<SaleItem>> GetItemsSoldByProductAsync(int productId, DateTime startDate, DateTime endDate);
}
