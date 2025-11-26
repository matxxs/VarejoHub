using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly ISubscriptionRepository _subscriptionRepository;

        public SubscriptionService(ISubscriptionRepository subscriptionRepository)
        {
            _subscriptionRepository = subscriptionRepository;
        }

        public async Task AddAsync(Subscription subscription)
        {
            await _subscriptionRepository.AddAsync(subscription);
        }

        public async Task UpdateAsync(Subscription subscription)
        {
            await _subscriptionRepository.UpdateAsync(subscription);
        }

        public async Task DeleteAsync(int id)
        {
            var subscription = await _subscriptionRepository.GetByIdAsync(id);
            if (subscription != null)
            {
                subscription.StatusAssinatura = "Cancelada";
                subscription.DataCancelamento = DateOnly.FromDateTime(DateTime.Now);
                await _subscriptionRepository.UpdateAsync(subscription);
            }
        }

        public Task<Subscription?> GetByIdAsync(int id)
        {
            return _subscriptionRepository.GetByIdAsync(id);
        }

        public Task<Subscription?> GetBySupermarketIdAsync(int supermarketId)
        {
            return _subscriptionRepository.GetBySupermarketIdAsync(supermarketId);
        }

        public Task<IEnumerable<Subscription>> GetAllAsync()
        {
            // Need to implement in repository
            throw new NotImplementedException("This method needs repository enhancement");
        }

        public Task<IEnumerable<Subscription>> GetByStatusAsync(string status)
        {
            return _subscriptionRepository.GetByStatusAsync(status);
        }
    }
}
