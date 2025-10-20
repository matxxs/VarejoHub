using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Repositories;

public interface ISupermarketRepository
{
    // CRUD Operations
    Task<Supermarket?> GetByIdAsync(int id);
    Task<IEnumerable<Supermarket>> GetAllAsync();
    Task AddAsync(Supermarket supermarket);
    Task UpdateAsync(Supermarket supermarket);
    Task DeleteAsync(int id);

    // Specific Queries
    Task<Supermarket?> GetByCnpjAsync(string cnpj);
    Task<bool> CnpjExistsAsync(string cnpj);
}