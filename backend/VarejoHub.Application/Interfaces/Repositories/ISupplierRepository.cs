using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Repositories;

public interface ISupplierRepository
{
    // CRUD Operations
    Task<Supplier?> GetByIdAsync(int id);
    Task<IEnumerable<Supplier>> GetAllBySupermarketIdAsync(int supermarketId);
    Task AddAsync(Supplier supplier);
    Task UpdateAsync(Supplier supplier);
    Task DeleteAsync(int id);

    // Specific Queries
    Task<Supplier?> GetByCnpjAsync(string cnpj);
    Task<IEnumerable<Supplier>> SearchByNameAsync(string name, int supermarketId);
}
