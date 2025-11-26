using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Services
{
    public class SaleItemService : ISaleItemService
    {
        private readonly ISaleItemRepository _saleItemRepository;

        public SaleItemService(ISaleItemRepository saleItemRepository)
        {
            _saleItemRepository = saleItemRepository;
        }

        public async Task AddAsync(SaleItem saleItem)
        {
            await _saleItemRepository.AddAsync(saleItem);
        }

        public async Task UpdateAsync(SaleItem saleItem)
        {
            // Sale items are typically immutable after creation
            throw new InvalidOperationException("Sale items cannot be modified after creation");
        }

        public async Task DeleteAsync(int id)
        {
            // Sale items are typically immutable after creation
            throw new InvalidOperationException("Sale items cannot be deleted after creation");
        }

        public Task<SaleItem?> GetByIdAsync(int id)
        {
            return _saleItemRepository.GetByIdAsync(id);
        }

        public Task<IEnumerable<SaleItem>> GetBySaleIdAsync(int saleId)
        {
            return _saleItemRepository.GetItemsBySaleIdAsync(saleId);
        }
    }
}
