using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Repositories;

public interface IFinancialTransactionRepository
{
    // CRUD Operations
    Task<FinancialTransaction?> GetByIdAsync(int id);
    Task<IEnumerable<FinancialTransaction>> GetAllBySupermarketIdAsync(int supermarketId);
    Task AddAsync(FinancialTransaction transaction);
    Task UpdateAsync(FinancialTransaction transaction);
    Task DeleteAsync(int id);

    // Specific Queries
    Task<IEnumerable<FinancialTransaction>> GetByTransactionTypeAsync(int supermarketId, string type);
    Task<IEnumerable<FinancialTransaction>> GetByStatusAsync(int supermarketId, string status);
    Task<IEnumerable<FinancialTransaction>> GetDueTransactionsAsync(int supermarketId, DateOnly dueDate);
}
