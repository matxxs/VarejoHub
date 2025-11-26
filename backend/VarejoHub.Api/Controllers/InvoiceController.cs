using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoiceController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInvoiceById(int id)
        {
            var invoice = await _invoiceService.GetByIdAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }
            return Ok(invoice);
        }

        [HttpGet("subscription/{subscriptionId}")]
        public async Task<IActionResult> GetInvoicesBySubscription(int subscriptionId)
        {
            var invoices = await _invoiceService.GetBySubscriptionIdAsync(subscriptionId);
            return Ok(invoices);
        }

        [HttpGet("supermarket/{supermarketId}")]
        public async Task<IActionResult> GetInvoicesBySupermarket(int supermarketId)
        {
            var invoices = await _invoiceService.GetBySupermarketIdAsync(supermarketId);
            return Ok(invoices);
        }

        [HttpPost]
        public async Task<IActionResult> CreateInvoice([FromBody] Invoice invoice)
        {
            await _invoiceService.AddAsync(invoice);
            return CreatedAtAction(nameof(GetInvoiceById), new { id = invoice.IdFatura }, invoice);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(int id, [FromBody] Invoice invoice)
        {
            if (id != invoice.IdFatura)
            {
                return BadRequest();
            }
            await _invoiceService.UpdateAsync(invoice);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            await _invoiceService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetInvoicesByStatus(string status)
        {
            var invoices = await _invoiceService.GetByStatusAsync(status);
            return Ok(invoices);
        }

        [HttpGet("overdue")]
        public async Task<IActionResult> GetOverdueInvoices()
        {
            var invoices = await _invoiceService.GetOverdueAsync();
            return Ok(invoices);
        }
    }
}
