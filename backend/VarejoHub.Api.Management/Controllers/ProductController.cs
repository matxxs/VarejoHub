using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Api.Management.Controllers
{
    [Authorize]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
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
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            await _productService.AddAsync(product);
            return CreatedAtAction(nameof(GetProductById), new { id = product.IdProduto }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product product)
        {
            if (id != product.IdProduto)
            {
                return BadRequest();
            }
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
