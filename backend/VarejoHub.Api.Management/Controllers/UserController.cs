using Microsoft.AspNetCore.Mvc;
using VarejoHub.Application.Interfaces.Services;

namespace VarejoHub.Api.Management.Controllers
{
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }


        [HttpGet("supermarket/{supermarketId}/users")]
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
        public async Task<IActionResult> CreateUser([FromBody] VarejoHub.Domain.Entities.User user)
        {
            await _userService.AddAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = user.IdUsuario }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] VarejoHub.Domain.Entities.User user)
        {
            if (id != user.IdUsuario)
            {
                return BadRequest();
            }
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
