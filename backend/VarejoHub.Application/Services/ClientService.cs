using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _clientRepository;

        public ClientService(IClientRepository clientRepository)
        {
            _clientRepository = clientRepository;
        }

        public async Task AddAsync(Client client)
        {
            await _clientRepository.AddAsync(client);
        }

        public async Task UpdateAsync(Client client)
        {
            await _clientRepository.UpdateAsync(client);
        }

        public async Task DeleteAsync(int id)
        {
            await _clientRepository.DeleteAsync(id);
        }

        public Task<Client?> GetByIdAsync(int id)
        {
            return _clientRepository.GetByIdAsync(id);
        }

        public Task<IEnumerable<Client>> GetAllBySupermarketIdAsync(int supermarketId)
        {
            return _clientRepository.GetAllBySupermarketIdAsync(supermarketId);
        }

        public Task<Client?> GetByCpfAsync(string cpf, int supermarketId)
        {
            return _clientRepository.GetByCpfAsync(cpf);
        }

        public Task<IEnumerable<Client>> SearchByNameAsync(string name, int supermarketId)
        {
            return _clientRepository.SearchByNameAsync(name, supermarketId);
        }
    }
}
