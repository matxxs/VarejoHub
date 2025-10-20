using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Services
{
    public interface IProductService
    {
        Task AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(int id);

        Task<Product?> GetByIdAsync(int id);
        Task<IEnumerable<Product>> GetAllBySupermarketIdAsync(int supermarketId);
        Task<Product?> GetByBarcodeAsync(string barcode, int supermarketId);
        Task<IEnumerable<Product>> GetLowStockAlertsAsync(int supermarketId);
        Task<IEnumerable<Product>> SearchByNameAsync(string name, int supermarketId);
    }
}
