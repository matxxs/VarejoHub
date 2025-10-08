using Microsoft.EntityFrameworkCore;
using System.Linq;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Domain.Entities;
using VarejoHub.Infrastructure.Data;
using VarejoHub.Infrastructure.Repositories;

public class PlanRepository : Repository<Plan>, IPlanRepository
{
    public PlanRepository(VarejoHubDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Plan>> GetActivePlansAsync()
    {
        return await _dbSet.Where(p => p.EAtivo).ToListAsync();
    }

    public async Task<Plan?> GetPlanByNameAsync(string name)
    {
        return await _dbSet.FirstOrDefaultAsync(p => p.NomePlano == name);
    }
}