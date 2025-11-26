using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlanController : ControllerBase
    {
        private readonly IPlanService _planService;
        private readonly ILogger<PlanController> _logger;

        public PlanController(IPlanService planService, ILogger<PlanController> logger)
        {
            _planService = planService;
            _logger = logger;
        }

        [AllowAnonymous] 
        [HttpGet("active")]
        [ProducesResponseType(typeof(IEnumerable<Plan>), 200)]
        public async Task<IActionResult> GetActivePlans()
        {
            var activePlans = await _planService.GetActivePlansAsync();
            return Ok(activePlans);
        }

        [Authorize(Policy = "GlobalAdminPolicy")]
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Plan>), 200)]
        public async Task<IActionResult> GetAllPlans()
        {
            var allPlans = await _planService.GetAllAsync();
            return Ok(allPlans);
        }

        [Authorize(Policy = "GlobalAdminPolicy")]
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(Plan), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetPlanById(int id)
        {
            var plan = await _planService.GetByIdAsync(id);
            if (plan == null)
            {
                return NotFound($"Plano com ID {id} não encontrado.");
            }
            return Ok(plan);
        }

        [Authorize(Policy = "GlobalAdminPolicy")]
        [HttpPost]
        [ProducesResponseType(typeof(Plan), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreatePlan([FromBody] Plan plan)
        {
            try
            {
                await _planService.AddAsync(plan);
                return CreatedAtAction(nameof(GetPlanById), new { id = plan.IdPlano }, plan);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Falha ao criar plano.");
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Policy = "GlobalAdminPolicy")]
        [HttpPut("{id:int}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdatePlan(int id, [FromBody] Plan plan)
        {
            if (id != plan.IdPlano)
            {
                return BadRequest("O ID da rota não corresponde ao ID do plano.");
            }

            try
            {
                await _planService.UpdateAsync(plan);
                return NoContent(); 
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Falha ao atualizar plano ID {PlanId}.", id);
                if (ex.Message.Contains("não encontrado"))
                    return NotFound(ex.Message);

                return BadRequest(ex.Message);
            }
        }

        [Authorize(Policy = "GlobalAdminPolicy")]
        [HttpDelete("{id:int}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeletePlan(int id)
        {
            try
            {
                await _planService.DeleteAsync(id);
                return NoContent(); 
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Falha ao deletar plano ID {PlanId}.", id);
                if (ex.Message.Contains("não encontrado"))
                    return NotFound(ex.Message);

                return BadRequest(ex.Message);
            }
        }
    }
}
