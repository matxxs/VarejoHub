using Microsoft.EntityFrameworkCore;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Domain.Entities;
using VarejoHub.Infrastructure.Data;
using VarejoHub.Infrastructure.Repositories;

public class SupplierRepository : Repository<Supplier>, ISupplierRepository
{
    public SupplierRepository(VarejoHubDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Supplier>> GetAllBySupermarketIdAsync(int supermarketId)
    {
        return await _dbSet.Where(s => s.IdSupermercado == supermarketId).ToListAsync();
    }

    public async Task<Supplier?> GetByCnpjAsync(string cnpj)
    {
        return await _dbSet.FirstOrDefaultAsync(s => s.Cnpj == cnpj);
    }

    public async Task<IEnumerable<Supplier>> SearchByNameAsync(string name, int supermarketId)
    {
        return await _dbSet
            .Where(s => s.IdSupermercado == supermarketId && s.NomeFantasia.Contains(name))
            .ToListAsync();
    }
}