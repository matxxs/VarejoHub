using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Services
{
    public class SaleService : ISaleService
    {
        private readonly ISaleRepository _saleRepository;

        public SaleService(ISaleRepository saleRepository)
        {
            _saleRepository = saleRepository;
        }

        public async Task AddAsync(Sale sale)
        {
            sale.DataHora = DateTime.Now;
            await _saleRepository.AddAsync(sale);
        }

        public async Task UpdateAsync(Sale sale)
        {
            throw new InvalidOperationException("Sales cannot be modified after creation");
        }

        public async Task DeleteAsync(int id)
        {
            throw new InvalidOperationException("Sales cannot be deleted after creation");
        }

        public Task<Sale?> GetByIdAsync(int id)
        {
            return _saleRepository.GetByIdAsync(id);
        }

        public Task<IEnumerable<Sale>> GetAllBySupermarketIdAsync(int supermarketId)
        {
            return _saleRepository.GetSalesBySupermarketIdAsync(supermarketId, DateTime.MinValue, DateTime.MaxValue);
        }

        public Task<IEnumerable<Sale>> GetByDateRangeAsync(int supermarketId, DateTime startDate, DateTime endDate)
        {
            return _saleRepository.GetSalesBySupermarketIdAsync(supermarketId, startDate, endDate);
        }

        public Task<IEnumerable<Sale>> GetByClientIdAsync(int clientId)
        {
            return _saleRepository.GetSalesByClientAsync(clientId);
        }
    }
}
