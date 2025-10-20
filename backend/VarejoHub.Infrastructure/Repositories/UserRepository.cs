using Microsoft.EntityFrameworkCore;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Domain.Entities;
using VarejoHub.Infrastructure.Data;

namespace VarejoHub.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository 
{
    public UserRepository(VarejoHubDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<User>> GetAllBySupermarketIdAsync(int supermarketId)
    {
        return await _dbSet.Where(u => u.IdSupermercado == supermarketId).ToListAsync();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByTemporaryTokenAsync(string token)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.TokenAcessoTemporario == token);
    }

    public async Task<IEnumerable<User>> GetByAccessLevelAsync(string accessLevel)
    {
        return await _dbSet.Where(u => u.NivelAcesso == accessLevel).ToListAsync();
    }

    public async Task<IEnumerable<User>> GetGlobalAdminsAsync()
    {
        return await _dbSet.Where(u => u.EGlobalAdmin).ToListAsync();
    }

    public async Task<int> GetCountBySupermarketIdAsync(int supermarketId)
    {
        return await _dbSet.CountAsync(u => u.IdSupermercado == supermarketId);
    }
}