using Microsoft.EntityFrameworkCore;
using VarejoHub.Application.DTOs;
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

    public async Task<UserDto?> GetMe(int id)
    {
        var user = await _context.Usuarios
            .Include(u => u.Supermercado)
                .ThenInclude(s => s.Assinatura)
                .ThenInclude(a => a.Plano)
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.IdUsuario == id);

        if (user == null)
        {
            return null;
        }

        var userDto = new UserDto
        {
            IdUsuario = user.IdUsuario,
            Nome = user.Nome,
            Email = user.Email,
            NivelAcesso = user.NivelAcesso,
            EGlobalAdmin = user.EGlobalAdmin,

            Supermercado = user.Supermercado == null ? null : new SupermarketDto
            {
                IdSupermercado = user.Supermercado.IdSupermercado,
                NomeFantasia = user.Supermercado.NomeFantasia,

                Plano = user.Supermercado.Assinatura == null ? null : new PlanoDto
                {
                    NomePlano = user.Supermercado.Assinatura.Plano.NomePlano,
                    StatusAssinatura = user.Supermercado.Assinatura.StatusAssinatura
                }
            }
        };

        return userDto;
    }
}