using VarejoHub.Application.DTOs;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Services;

public interface IUserService
{
    Task AddAsync(User usuario);
    Task UpdateAsync(User usuario);

    Task DeleteAsync(int id);
    Task<UserDto?> GetByIdAsync(int id);

    Task<IEnumerable<User>> GetAllBySupermarketIdAsync(int supermarketId);
    Task<User?> GetByEmailAsync(string email);
}
