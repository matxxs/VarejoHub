using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Services
{
    public class StockMovementService : IStockMovementService
    {
        private readonly IStockMovementRepository _stockMovementRepository;
        private readonly IProductRepository _productRepository;

        public StockMovementService(IStockMovementRepository stockMovementRepository, IProductRepository productRepository)
        {
            _stockMovementRepository = stockMovementRepository;
            _productRepository = productRepository;
        }

        public async Task AddAsync(StockMovement stockMovement)
        {
            stockMovement.DataHora = DateTime.Now;
            
            // Update product stock based on movement type
            var product = await _productRepository.GetByIdAsync(stockMovement.IdProduto);
            if (product != null)
            {
                switch (stockMovement.TipoMovimentacao.ToLower())
                {
                    case "entrada":
                        product.EstoqueAtual += stockMovement.Quantidade;
                        break;
                    case "saida_venda":
                    case "perda":
                    case "vencimento":
                        product.EstoqueAtual -= stockMovement.Quantidade;
                        break;
                    case "ajuste":
                        // Ajuste can be positive or negative
                        product.EstoqueAtual = stockMovement.Quantidade;
                        break;
                }
                await _productRepository.UpdateAsync(product);
            }

            await _stockMovementRepository.AddAsync(stockMovement);
        }

        public async Task UpdateAsync(StockMovement stockMovement)
        {
            // Stock movements are typically immutable after creation
            throw new InvalidOperationException("Stock movements cannot be modified after creation");
        }

        public async Task DeleteAsync(int id)
        {
            // Stock movements are typically immutable after creation
            throw new InvalidOperationException("Stock movements cannot be deleted after creation");
        }

        public Task<StockMovement?> GetByIdAsync(int id)
        {
            return _stockMovementRepository.GetByIdAsync(id);
        }

        public Task<IEnumerable<StockMovement>> GetAllBySupermarketIdAsync(int supermarketId)
        {
            // Need to implement in repository
            throw new NotImplementedException("This method needs repository enhancement");
        }

        public Task<IEnumerable<StockMovement>> GetByProductIdAsync(int productId)
        {
            return _stockMovementRepository.GetByProductIdAsync(productId);
        }

        public Task<IEnumerable<StockMovement>> GetByTypeAsync(int supermarketId, string type)
        {
            return _stockMovementRepository.GetMovementsByTypeAsync(supermarketId, type);
        }
    }
}
