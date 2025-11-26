using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Services
{
    public interface IClientService
    {
        Task AddAsync(Client client);
        Task UpdateAsync(Client client);
        Task DeleteAsync(int id);
        Task<Client?> GetByIdAsync(int id);
        Task<IEnumerable<Client>> GetAllBySupermarketIdAsync(int supermarketId);
        Task<Client?> GetByCpfAsync(string cpf, int supermarketId);
        Task<IEnumerable<Client>> SearchByNameAsync(string name, int supermarketId);
    }
}
