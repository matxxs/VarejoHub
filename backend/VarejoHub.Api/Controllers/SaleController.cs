using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class SaleController : ControllerBase
    {
        private readonly ISaleService _saleService;

        public SaleController(ISaleService saleService)
        {
            _saleService = saleService;
        }

        [HttpGet("supermarket/{supermarketId}")]
        public async Task<IActionResult> GetSalesBySupermarket(int supermarketId)
        {
            var sales = await _saleService.GetAllBySupermarketIdAsync(supermarketId);
            return Ok(sales);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSaleById(int id)
        {
            var sale = await _saleService.GetByIdAsync(id);
            if (sale == null)
            {
                return NotFound();
            }
            return Ok(sale);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSale([FromBody] Sale sale)
        {
            await _saleService.AddAsync(sale);
            return CreatedAtAction(nameof(GetSaleById), new { id = sale.IdVenda }, sale);
        }

        [HttpGet("supermarket/{supermarketId}/daterange")]
        public async Task<IActionResult> GetSalesByDateRange(
            int supermarketId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var sales = await _saleService.GetByDateRangeAsync(supermarketId, startDate, endDate);
            return Ok(sales);
        }

        [HttpGet("client/{clientId}")]
        public async Task<IActionResult> GetSalesByClient(int clientId)
        {
            var sales = await _saleService.GetByClientIdAsync(clientId);
            return Ok(sales);
        }
    }
}
