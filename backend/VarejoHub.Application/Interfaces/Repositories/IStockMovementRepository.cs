using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Repositories;

public interface IStockMovementRepository
{
    // CRUD Operations
    Task<StockMovement?> GetByIdAsync(int id);
    Task<IEnumerable<StockMovement>> GetByProductIdAsync(int productId);
    Task AddAsync(StockMovement movement);
    // Update/Delete are less common for movements, but can be added if needed

    // Specific Queries
    Task<IEnumerable<StockMovement>> GetMovementsByTypeAsync(int supermarketId, string movementType);
    Task<decimal> GetTotalQuantityMovedAsync(int productId, string movementType, DateTime startDate, DateTime endDate);
}
