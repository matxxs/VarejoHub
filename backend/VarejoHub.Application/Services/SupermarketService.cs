using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Services
{
    public class SupermarketService : ISupermarketService
    {
        private readonly ISupermarketRepository _supermarketRepository;

        public SupermarketService(ISupermarketRepository supermarketRepository)
        {
            _supermarketRepository = supermarketRepository;
        }

        public async Task AddAsync(Supermarket supermarket)
        {
            await _supermarketRepository.AddAsync(supermarket);
        }

        public async Task UpdateAsync(Supermarket supermarket)
        {
            await _supermarketRepository.UpdateAsync(supermarket);
        }

        public async Task DeleteAsync(int id)
        {
            await _supermarketRepository.DeleteAsync(id);
        }

        public Task<Supermarket?> GetByIdAsync(int id)
        {
            return _supermarketRepository.GetByIdAsync(id);
        }

        public Task<IEnumerable<Supermarket>> GetAllAsync()
        {
            return _supermarketRepository.GetAllAsync();
        }

        public Task<Supermarket?> GetByCnpjAsync(string cnpj)
        {
            return _supermarketRepository.GetByCnpjAsync(cnpj);
        }
    }
}
