using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Services
{
    public class SupplierService : ISupplierService
    {
        private readonly ISupplierRepository _supplierRepository;

        public SupplierService(ISupplierRepository supplierRepository)
        {
            _supplierRepository = supplierRepository;
        }

        public async Task AddAsync(Supplier supplier)
        {
            await _supplierRepository.AddAsync(supplier);
        }

        public async Task UpdateAsync(Supplier supplier)
        {
            await _supplierRepository.UpdateAsync(supplier);
        }

        public async Task DeleteAsync(int id)
        {
            await _supplierRepository.DeleteAsync(id);
        }

        public Task<Supplier?> GetByIdAsync(int id)
        {
            return _supplierRepository.GetByIdAsync(id);
        }

        public Task<IEnumerable<Supplier>> GetAllBySupermarketIdAsync(int supermarketId)
        {
            return _supplierRepository.GetAllBySupermarketIdAsync(supermarketId);
        }

        public Task<Supplier?> GetByCnpjAsync(string cnpj, int supermarketId)
        {
            return _supplierRepository.GetByCnpjAsync(cnpj);
        }

        public Task<IEnumerable<Supplier>> SearchByNameAsync(string name, int supermarketId)
        {
            return _supplierRepository.SearchByNameAsync(name, supermarketId);
        }
    }
}
