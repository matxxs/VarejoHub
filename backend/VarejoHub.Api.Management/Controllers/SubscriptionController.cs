using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Api.Management.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionService _subscriptionService;

        public SubscriptionController(ISubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSubscriptions()
        {
            var subscriptions = await _subscriptionService.GetAllAsync();
            return Ok(subscriptions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubscriptionById(int id)
        {
            var subscription = await _subscriptionService.GetByIdAsync(id);
            if (subscription == null)
            {
                return NotFound();
            }
            return Ok(subscription);
        }

        [HttpGet("supermarket/{supermarketId}")]
        public async Task<IActionResult> GetSubscriptionBySupermarket(int supermarketId)
        {
            var subscription = await _subscriptionService.GetBySupermarketIdAsync(supermarketId);
            if (subscription == null)
            {
                return NotFound();
            }
            return Ok(subscription);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSubscription([FromBody] Subscription subscription)
        {
            await _subscriptionService.AddAsync(subscription);
            return CreatedAtAction(nameof(GetSubscriptionById), new { id = subscription.IdAssinatura }, subscription);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubscription(int id, [FromBody] Subscription subscription)
        {
            if (id != subscription.IdAssinatura)
            {
                return BadRequest();
            }
            await _subscriptionService.UpdateAsync(subscription);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubscription(int id)
        {
            await _subscriptionService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetSubscriptionsByStatus(string status)
        {
            var subscriptions = await _subscriptionService.GetByStatusAsync(status);
            return Ok(subscriptions);
        }
    }
}
