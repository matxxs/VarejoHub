using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Repositories;

public interface IPlanRepository
{
    // CRUD Operations
    Task<Plan?> GetByIdAsync(int id);
    Task<IEnumerable<Plan>> GetAllAsync();
    Task AddAsync(Plan plan);
    Task UpdateAsync(Plan plan);
    Task DeleteAsync(int id);

    // Specific Queries
    Task<IEnumerable<Plan>> GetActivePlansAsync();
    Task<Plan?> GetPlanByNameAsync(string name);
}
