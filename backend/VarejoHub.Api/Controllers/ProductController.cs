using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VarejoHub.Application.DTOs.Request;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;


namespace VarejoHub.Api.Controllers
{
    [Authorize]
    [ApiController] 
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        private readonly IProductRepository _productRepository;
        public ProductController(IProductService productService, IProductRepository productRepository)
        {
            _productService = productService;
            _productRepository = productRepository;
        }

        [HttpGet("supermarket/{supermarketId}/products")]
        public async Task<IActionResult> GetProductsBySupermarket(int supermarketId)
        {
            var products = await _productService.GetAllBySupermarketIdAsync(supermarketId);
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            await _productService.DeleteAsync(id);
            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] ProductCreateDto productDto)
        {
            var product = new Product
            {
                IdSupermercado = productDto.IdSupermercado,
                CodigoBarras = productDto.CodigoBarras,
                Nome = productDto.Nome,
                UnidadeMedida = productDto.UnidadeMedida,
                EstoqueAtual = productDto.EstoqueAtual,
                PrecoCusto = productDto.PrecoCusto,
                PrecoVenda = productDto.PrecoVenda,
                AlertaBaixoEstoque = productDto.AlertaBaixoEstoque,

                DataCadastro = DateTime.Now
            };

            await _productService.AddAsync(product);

            return CreatedAtAction(nameof(GetProductById), new { id = product.IdProduto }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductUpdateDto productDto)
        {
            if (id != productDto.IdProduto)
            {
                return BadRequest("O ID da URL não corresponde ao ID do produto enviado.");
            }

            var product = await _productRepository.GetByIdAsync(id);

            if (product == null)
            {
                return NotFound("Produto não encontrado.");
            }

            product.CodigoBarras = productDto.CodigoBarras;
            product.Nome = productDto.Nome;
            product.UnidadeMedida = productDto.UnidadeMedida;
            product.EstoqueAtual = productDto.EstoqueAtual;
            product.PrecoCusto = productDto.PrecoCusto;
            product.PrecoVenda = productDto.PrecoVenda;
            product.AlertaBaixoEstoque = productDto.AlertaBaixoEstoque;


            await _productService.UpdateAsync(product);

            return NoContent();
        }

        [HttpGet("supermarket/{supermarketId}/products/low-stock")]
        public async Task<IActionResult> GetLowStockAlerts(int supermarketId)
        {
            var products = await _productService.GetLowStockAlertsAsync(supermarketId);
            return Ok(products);
        }

        [HttpGet("supermarket/{supermarketId}/products/search")]
        public async Task<IActionResult> SearchProductsByName(int supermarketId, [FromQuery] string name)
        {
            var products = await _productService.SearchByNameAsync(name, supermarketId);
            return Ok(products);
        }

        [HttpGet("supermarket/{supermarketId}/products/barcode/{barcode}")]
        public async Task<IActionResult> GetProductByBarcode(int supermarketId, string barcode)
        {
            var product = await _productService.GetByBarcodeAsync(barcode, supermarketId);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }
    }
}
