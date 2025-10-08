using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Repositories;

public interface IClientRepository
{
    // CRUD Operations
    Task<Client?> GetByIdAsync(int id);
    Task<IEnumerable<Client>> GetAllBySupermarketIdAsync(int supermarketId);
    Task AddAsync(Client client);
    Task UpdateAsync(Client client);
    Task DeleteAsync(int id);

    // Specific Queries
    Task<Client?> GetByCpfAsync(string cpf);
    Task<IEnumerable<Client>> GetClientsWithMinPointsAsync(int supermarketId, int minPoints);
    Task UpdateLoyaltyPointsAsync(int clientId, int pointsChange);
}
