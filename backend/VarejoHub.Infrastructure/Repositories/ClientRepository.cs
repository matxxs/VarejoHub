using Microsoft.EntityFrameworkCore;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Domain.Entities;
using VarejoHub.Infrastructure.Data;
using VarejoHub.Infrastructure.Repositories;

public class ClientRepository : Repository<Client>, IClientRepository
{
    public ClientRepository(VarejoHubDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Client>> GetAllBySupermarketIdAsync(int supermarketId)
    {
        return await _dbSet.Where(c => c.IdSupermercado == supermarketId).ToListAsync();
    }

    public async Task<Client?> GetByCpfAsync(string cpf)
    {
        return await _dbSet.FirstOrDefaultAsync(c => c.Cpf == cpf);
    }

    public async Task<IEnumerable<Client>> GetClientsWithMinPointsAsync(int supermarketId, int minPoints)
    {
        return await _dbSet
            .Where(c => c.IdSupermercado == supermarketId && c.PontosFidelidade >= minPoints)
            .ToListAsync();
    }

    public async Task UpdateLoyaltyPointsAsync(int clientId, int pointsChange)
    {
        var client = await _dbSet.FindAsync(clientId);
        if (client != null)
        {
            client.PontosFidelidade += pointsChange;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Client>> SearchByNameAsync(string name, int supermarketId)
    {
        return await _dbSet
            .Where(c => c.IdSupermercado == supermarketId && c.Nome.Contains(name))
            .ToListAsync();
    }
}