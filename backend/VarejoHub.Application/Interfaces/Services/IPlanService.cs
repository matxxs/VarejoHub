using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Services
{
    public interface IPlanService
    {
        Task AddAsync(Plan plan);
        Task UpdateAsync(Plan plan);
        Task<Plan?> GetByIdAsync(int id);
        Task<IEnumerable<Plan>> GetAllAsync();
        Task DeleteAsync(int id);

        Task<IEnumerable<Plan>> GetActivePlansAsync();
    }
}
