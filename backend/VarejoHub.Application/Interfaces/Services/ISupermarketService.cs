using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Services
{
    public interface ISupermarketService
    {
        Task AddAsync(Supermarket supermarket);
        Task UpdateAsync(Supermarket supermarket);
        Task DeleteAsync(int id);
        Task<Supermarket?> GetByIdAsync(int id);
        Task<IEnumerable<Supermarket>> GetAllAsync();
        Task<Supermarket?> GetByCnpjAsync(string cnpj);
    }
}
