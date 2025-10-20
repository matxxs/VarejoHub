using Microsoft.EntityFrameworkCore;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Domain.Entities;
using VarejoHub.Infrastructure.Data;

namespace VarejoHub.Infrastructure.Repositories
{
    public class SupermarketRepository : Repository<Supermarket>, ISupermarketRepository
    {
        public SupermarketRepository(VarejoHubDbContext context) : base(context)
        {
        }

        public override async Task<Supermarket?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(supermarket => supermarket.Assinatura)
                .FirstOrDefaultAsync(supermarket => supermarket.IdSupermercado == id);
        }

        public async Task<Supermarket?> GetByCnpjAsync(string cnpj)
        {
            return await _dbSet.FirstOrDefaultAsync(s => s.Cnpj == cnpj);
        }

        public async Task<bool> CnpjExistsAsync(string cnpj)
        {
            return await _dbSet.AnyAsync(s => s.Cnpj == cnpj);
        }
    }
}
