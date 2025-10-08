using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Repositories;

public interface IProductRepository
{
    // CRUD Operations
    Task<Product?> GetByIdAsync(int id);
    Task<IEnumerable<Product>> GetAllBySupermarketIdAsync(int supermarketId);
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(int id);

    // Specific Queries
    Task<Product?> GetByBarcodeAsync(string barcode, int supermarketId);
    Task<IEnumerable<Product>> GetLowStockAlertsAsync(int supermarketId);
    Task<IEnumerable<Product>> SearchByNameAsync(string name, int supermarketId);
}