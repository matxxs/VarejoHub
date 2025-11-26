using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ClientController : ControllerBase
    {
        private readonly IClientService _clientService;

        public ClientController(IClientService clientService)
        {
            _clientService = clientService;
        }

        [HttpGet("supermarket/{supermarketId}")]
        public async Task<IActionResult> GetClientsBySupermarket(int supermarketId)
        {
            var clients = await _clientService.GetAllBySupermarketIdAsync(supermarketId);
            return Ok(clients);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetClientById(int id)
        {
            var client = await _clientService.GetByIdAsync(id);
            if (client == null)
            {
                return NotFound();
            }
            return Ok(client);
        }

        [HttpPost]
        public async Task<IActionResult> CreateClient([FromBody] Client client)
        {
            await _clientService.AddAsync(client);
            return CreatedAtAction(nameof(GetClientById), new { id = client.IdCliente }, client);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient(int id, [FromBody] Client client)
        {
            if (id != client.IdCliente)
            {
                return BadRequest();
            }
            await _clientService.UpdateAsync(client);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            await _clientService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("supermarket/{supermarketId}/search")]
        public async Task<IActionResult> SearchClientsByName(int supermarketId, [FromQuery] string name)
        {
            var clients = await _clientService.SearchByNameAsync(name, supermarketId);
            return Ok(clients);
        }

        [HttpGet("cpf/{cpf}")]
        public async Task<IActionResult> GetClientByCpf(string cpf, [FromQuery] int supermarketId)
        {
            var client = await _clientService.GetByCpfAsync(cpf, supermarketId);
            if (client == null)
            {
                return NotFound();
            }
            return Ok(client);
        }
    }
}
