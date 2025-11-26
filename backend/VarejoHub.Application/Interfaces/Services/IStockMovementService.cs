using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Services
{
    public interface IStockMovementService
    {
        Task AddAsync(StockMovement stockMovement);
        Task UpdateAsync(StockMovement stockMovement);
        Task DeleteAsync(int id);
        Task<StockMovement?> GetByIdAsync(int id);
        Task<IEnumerable<StockMovement>> GetAllBySupermarketIdAsync(int supermarketId);
        Task<IEnumerable<StockMovement>> GetByProductIdAsync(int productId);
        Task<IEnumerable<StockMovement>> GetByTypeAsync(int supermarketId, string type);
    }
}
