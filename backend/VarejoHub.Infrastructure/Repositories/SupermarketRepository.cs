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

        public async Task<Supermarket?> GetByCnpjAsync(string cnpj)
        {
            return await _dbSet.FirstOrDefaultAsync(s => s.Cnpj == cnpj);
        }

        public async Task<bool> CnpjExistsAsync(string cnpj)
        {
            return await _dbSet.AnyAsync(s => s.Cnpj == cnpj);
        }

        public async Task<IEnumerable<Supermarket>> GetByStatusAsync(string status)
        {
            return await _dbSet.Where(s => s.Status == status).ToListAsync();
        }
    }
}
