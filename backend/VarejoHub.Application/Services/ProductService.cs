using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ISubscriptionRepository _subscriptionRepository;

    public ProductService(IProductRepository productRepository,
                          ISubscriptionRepository subscriptionRepository)
    {
        _productRepository = productRepository;
        _subscriptionRepository = subscriptionRepository;
    }

    /// <summary>
    /// Adiciona um novo produto, validando o limite do plano.
    /// </summary>
    public async Task AddAsync(Product product)
    {
        var signature = await _subscriptionRepository.GetBySupermarketIdAsync(product.IdSupermercado);

        if (signature != null && signature.Plano.LimiteProdutos.HasValue)
        {
            var currentCount = await _productRepository.GetAllBySupermarketIdAsync(product.IdSupermercado);
            int totalProducts = currentCount.Count();

            if (totalProducts >= signature.Plano.LimiteProdutos.Value)
            {
                throw new System.Exception($"Limite de {signature.Plano.LimiteProdutos.Value} produtos atingido para o seu plano.");
            }
        }

        await _productRepository.AddAsync(product);
    }

    /// <summary>
    /// Atualiza um produto.
    /// </summary>
    public async Task UpdateAsync(Product product)
    {
        await _productRepository.UpdateAsync(product);
    }

    /// <summary>
    /// Deleta um produto.
    /// </summary>
    public async Task DeleteAsync(int id)
    {
        await _productRepository.DeleteAsync(id);
    }

    // --- Métodos restantes são pass-through (chamam o repositório diretamente) ---

    public Task<Product?> GetByIdAsync(int id)
    {
        return _productRepository.GetByIdAsync(id);
    }

    public Task<IEnumerable<Product>> GetAllBySupermarketIdAsync(int supermarketId)
    {
        return _productRepository.GetAllBySupermarketIdAsync(supermarketId);
    }

    public Task<Product?> GetByBarcodeAsync(string barcode, int supermarketId)
    {
        return _productRepository.GetByBarcodeAsync(barcode, supermarketId);
    }

    public Task<IEnumerable<Product>> GetLowStockAlertsAsync(int supermarketId)
    {
        return _productRepository.GetLowStockAlertsAsync(supermarketId);
    }

    public Task<IEnumerable<Product>> SearchByNameAsync(string name, int supermarketId)
    {
        return _productRepository.SearchByNameAsync(name, supermarketId);
    }
}
