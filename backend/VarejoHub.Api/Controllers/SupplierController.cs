using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierService _supplierService;

        public SupplierController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        [HttpGet("supermarket/{supermarketId}")]
        public async Task<IActionResult> GetSuppliersBySupermarket(int supermarketId)
        {
            var suppliers = await _supplierService.GetAllBySupermarketIdAsync(supermarketId);
            return Ok(suppliers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSupplierById(int id)
        {
            var supplier = await _supplierService.GetByIdAsync(id);
            if (supplier == null)
            {
                return NotFound();
            }
            return Ok(supplier);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSupplier([FromBody] Supplier supplier)
        {
            await _supplierService.AddAsync(supplier);
            return CreatedAtAction(nameof(GetSupplierById), new { id = supplier.IdFornecedor }, supplier);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSupplier(int id, [FromBody] Supplier supplier)
        {
            if (id != supplier.IdFornecedor)
            {
                return BadRequest();
            }
            await _supplierService.UpdateAsync(supplier);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            await _supplierService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("supermarket/{supermarketId}/search")]
        public async Task<IActionResult> SearchSuppliersByName(int supermarketId, [FromQuery] string name)
        {
            var suppliers = await _supplierService.SearchByNameAsync(name, supermarketId);
            return Ok(suppliers);
        }

        [HttpGet("cnpj/{cnpj}")]
        public async Task<IActionResult> GetSupplierByCnpj(string cnpj, [FromQuery] int supermarketId)
        {
            var supplier = await _supplierService.GetByCnpjAsync(cnpj, supermarketId);
            if (supplier == null)
            {
                return NotFound();
            }
            return Ok(supplier);
        }
    }
}
