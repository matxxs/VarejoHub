using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class SupermarketController : ControllerBase
    {
        private readonly ISupermarketService _supermarketService;

        public SupermarketController(ISupermarketService supermarketService)
        {
            _supermarketService = supermarketService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSupermarkets()
        {
            var supermarkets = await _supermarketService.GetAllAsync();
            return Ok(supermarkets);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSupermarketById(int id)
        {
            var supermarket = await _supermarketService.GetByIdAsync(id);
            if (supermarket == null)
            {
                return NotFound();
            }
            return Ok(supermarket);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSupermarket([FromBody] Supermarket supermarket)
        {
            await _supermarketService.AddAsync(supermarket);
            return CreatedAtAction(nameof(GetSupermarketById), new { id = supermarket.IdSupermercado }, supermarket);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSupermarket(int id, [FromBody] Supermarket supermarket)
        {
            if (id != supermarket.IdSupermercado)
            {
                return BadRequest();
            }
            await _supermarketService.UpdateAsync(supermarket);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupermarket(int id)
        {
            await _supermarketService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("cnpj/{cnpj}")]
        public async Task<IActionResult> GetSupermarketByCnpj(string cnpj)
        {
            var supermarket = await _supermarketService.GetByCnpjAsync(cnpj);
            if (supermarket == null)
            {
                return NotFound();
            }
            return Ok(supermarket);
        }
    }
}
