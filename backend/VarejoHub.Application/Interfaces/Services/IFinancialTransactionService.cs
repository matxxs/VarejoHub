using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Services
{
    public interface IFinancialTransactionService
    {
        Task AddAsync(FinancialTransaction transaction);
        Task UpdateAsync(FinancialTransaction transaction);
        Task DeleteAsync(int id);
        Task<FinancialTransaction?> GetByIdAsync(int id);
        Task<IEnumerable<FinancialTransaction>> GetAllBySupermarketIdAsync(int supermarketId);
        Task<IEnumerable<FinancialTransaction>> GetByTypeAsync(int supermarketId, string type);
        Task<IEnumerable<FinancialTransaction>> GetByDateRangeAsync(int supermarketId, DateTime startDate, DateTime endDate);
        Task<decimal> GetBalanceAsync(int supermarketId);
    }
}
