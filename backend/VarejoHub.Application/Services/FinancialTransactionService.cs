using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Services
{
    public class FinancialTransactionService : IFinancialTransactionService
    {
        private readonly IFinancialTransactionRepository _financialTransactionRepository;

        public FinancialTransactionService(IFinancialTransactionRepository financialTransactionRepository)
        {
            _financialTransactionRepository = financialTransactionRepository;
        }

        public async Task AddAsync(FinancialTransaction transaction)
        {
            await _financialTransactionRepository.AddAsync(transaction);
        }

        public async Task UpdateAsync(FinancialTransaction transaction)
        {
            await _financialTransactionRepository.UpdateAsync(transaction);
        }

        public async Task DeleteAsync(int id)
        {
            await _financialTransactionRepository.DeleteAsync(id);
        }

        public Task<FinancialTransaction?> GetByIdAsync(int id)
        {
            return _financialTransactionRepository.GetByIdAsync(id);
        }

        public Task<IEnumerable<FinancialTransaction>> GetAllBySupermarketIdAsync(int supermarketId)
        {
            return _financialTransactionRepository.GetAllBySupermarketIdAsync(supermarketId);
        }

        public Task<IEnumerable<FinancialTransaction>> GetByTypeAsync(int supermarketId, string type)
        {
            return _financialTransactionRepository.GetByTransactionTypeAsync(supermarketId, type);
        }

        public Task<IEnumerable<FinancialTransaction>> GetByDateRangeAsync(int supermarketId, DateTime startDate, DateTime endDate)
        {
            // This needs to be implemented in the repository
            throw new NotImplementedException("This method needs repository enhancement");
        }

        public Task<decimal> GetBalanceAsync(int supermarketId)
        {
            // This needs to be implemented in the repository
            throw new NotImplementedException("This method needs repository enhancement");
        }
    }
}
