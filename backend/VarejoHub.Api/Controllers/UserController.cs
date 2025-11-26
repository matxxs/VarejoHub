using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.DTOs.Request;

namespace VarejoHub.Api.Controllers
{
    [Authorize]
    [ApiController] 
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;

        public UserController(IUserService userService, IUserRepository userRepository)
        {
            _userService = userService;
            _userRepository = userRepository;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized("Token inválido ou não contém o ID do usuário.");
            }

            if (!int.TryParse(userIdString, out var userId))
            {
                return Unauthorized("Formato de ID inválido no token.");
            }

            var user = await _userService.GetMe(userId);
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            return Ok(user);
        }


        [HttpGet("supermarket/{supermarketId}")]
        public async Task<IActionResult> GetUsersBySupermarket(int supermarketId)
        {
            var users = await _userService.GetAllBySupermarketIdAsync(supermarketId);
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteAsync(id);
            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto userDto)
        {
            var user = new VarejoHub.Domain.Entities.User
            {
                IdSupermercado = userDto.IdSupermercado,
                Email = userDto.Email,
                Nome = userDto.Nome,
                NivelAcesso = userDto.NivelAcesso,

                // O usuário não pode definir isso na criação!
                Confirmado = false,
                EGlobalAdmin = false,
                TokenAcessoTemporario = null, 
                DataExpiracaoToken = null
            };

            await _userService.AddAsync(user);

            return CreatedAtAction(nameof(GetUserById), new { id = user.IdUsuario }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto userDto)
        {
            if (id != userDto.IdUsuario)
            {
                return BadRequest("O ID da URL não corresponde ao ID do usuário enviado.");
            }

            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            user.Nome = userDto.Nome;
            user.NivelAcesso = userDto.NivelAcesso;
            user.IdSupermercado = userDto.IdSupermercado;

            await _userService.UpdateAsync(user);

            return NoContent();

        }

        [HttpPost]
        [Route("by-email")]
        public async Task<IActionResult> GetUserByEmail([FromBody] string email)
        {
            var user = await _userService.GetByEmailAsync(email);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

    }
}
