using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Repositories;

public interface IUserRepository
{
    // CRUD Operations
    Task<User?> GetByIdAsync(int id);
    Task<IEnumerable<User>> GetAllBySupermarketIdAsync(int supermarketId);
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(int id);

    // Specific Queries
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByTemporaryTokenAsync(string token);
    Task<IEnumerable<User>> GetByAccessLevelAsync(string accessLevel);
    Task<IEnumerable<User>> GetGlobalAdminsAsync();
}