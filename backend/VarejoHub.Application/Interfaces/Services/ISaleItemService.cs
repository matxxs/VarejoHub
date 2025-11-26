using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Services
{
    public interface ISaleItemService
    {
        Task AddAsync(SaleItem saleItem);
        Task UpdateAsync(SaleItem saleItem);
        Task DeleteAsync(int id);
        Task<SaleItem?> GetByIdAsync(int id);
        Task<IEnumerable<SaleItem>> GetBySaleIdAsync(int saleId);
    }
}
