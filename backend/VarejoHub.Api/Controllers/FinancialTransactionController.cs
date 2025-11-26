using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class FinancialTransactionController : ControllerBase
    {
        private readonly IFinancialTransactionService _financialTransactionService;

        public FinancialTransactionController(IFinancialTransactionService financialTransactionService)
        {
            _financialTransactionService = financialTransactionService;
        }

        [HttpGet("supermarket/{supermarketId}")]
        public async Task<IActionResult> GetTransactionsBySupermarket(int supermarketId)
        {
            var transactions = await _financialTransactionService.GetAllBySupermarketIdAsync(supermarketId);
            return Ok(transactions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransactionById(int id)
        {
            var transaction = await _financialTransactionService.GetByIdAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }
            return Ok(transaction);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction([FromBody] FinancialTransaction transaction)
        {
            await _financialTransactionService.AddAsync(transaction);
            return CreatedAtAction(nameof(GetTransactionById), new { id = transaction.IdTransacao }, transaction);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, [FromBody] FinancialTransaction transaction)
        {
            if (id != transaction.IdTransacao)
            {
                return BadRequest();
            }
            await _financialTransactionService.UpdateAsync(transaction);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            await _financialTransactionService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("supermarket/{supermarketId}/type/{type}")]
        public async Task<IActionResult> GetTransactionsByType(int supermarketId, string type)
        {
            var transactions = await _financialTransactionService.GetByTypeAsync(supermarketId, type);
            return Ok(transactions);
        }

        [HttpGet("supermarket/{supermarketId}/daterange")]
        public async Task<IActionResult> GetTransactionsByDateRange(
            int supermarketId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var transactions = await _financialTransactionService.GetByDateRangeAsync(supermarketId, startDate, endDate);
            return Ok(transactions);
        }

        [HttpGet("supermarket/{supermarketId}/balance")]
        public async Task<IActionResult> GetBalance(int supermarketId)
        {
            var balance = await _financialTransactionService.GetBalanceAsync(supermarketId);
            return Ok(new { SupermarketId = supermarketId, Balance = balance });
        }
    }
}
