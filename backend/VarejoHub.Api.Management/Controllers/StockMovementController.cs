using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Api.Management.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class StockMovementController : ControllerBase
    {
        private readonly IStockMovementService _stockMovementService;

        public StockMovementController(IStockMovementService stockMovementService)
        {
            _stockMovementService = stockMovementService;
        }

        [HttpGet("supermarket/{supermarketId}")]
        public async Task<IActionResult> GetStockMovementsBySupermarket(int supermarketId)
        {
            var movements = await _stockMovementService.GetAllBySupermarketIdAsync(supermarketId);
            return Ok(movements);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStockMovementById(int id)
        {
            var movement = await _stockMovementService.GetByIdAsync(id);
            if (movement == null)
            {
                return NotFound();
            }
            return Ok(movement);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStockMovement([FromBody] StockMovement stockMovement)
        {
            await _stockMovementService.AddAsync(stockMovement);
            return CreatedAtAction(nameof(GetStockMovementById), new { id = stockMovement.IdMovimentacao }, stockMovement);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStockMovement(int id, [FromBody] StockMovement stockMovement)
        {
            if (id != stockMovement.IdMovimentacao)
            {
                return BadRequest();
            }
            await _stockMovementService.UpdateAsync(stockMovement);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStockMovement(int id)
        {
            await _stockMovementService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetStockMovementsByProduct(int productId)
        {
            var movements = await _stockMovementService.GetByProductIdAsync(productId);
            return Ok(movements);
        }

        [HttpGet("supermarket/{supermarketId}/type/{type}")]
        public async Task<IActionResult> GetStockMovementsByType(int supermarketId, string type)
        {
            var movements = await _stockMovementService.GetByTypeAsync(supermarketId, type);
            return Ok(movements);
        }
    }
}
