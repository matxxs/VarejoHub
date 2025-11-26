using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Services
{
    public interface ISupplierService
    {
        Task AddAsync(Supplier supplier);
        Task UpdateAsync(Supplier supplier);
        Task DeleteAsync(int id);
        Task<Supplier?> GetByIdAsync(int id);
        Task<IEnumerable<Supplier>> GetAllBySupermarketIdAsync(int supermarketId);
        Task<Supplier?> GetByCnpjAsync(string cnpj, int supermarketId);
        Task<IEnumerable<Supplier>> SearchByNameAsync(string name, int supermarketId);
    }
}
