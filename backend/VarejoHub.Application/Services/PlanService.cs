using Microsoft.Extensions.Logging;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Domain.Entities;
using VarejoHub.Application.Interfaces.Services;

namespace VarejoHub.Application.Services
{
    public class PlanService: IPlanService
    {
        private readonly IPlanRepository _planRepository;
        private readonly ISubscriptionRepository _subscriptionRepository;
        private readonly ILogger<PlanService> _logger;

        //Regra: Maximo de planos ativos: 4  (Free, Básico, Profissional, Premium)
        private const int MAX_ACTIVE_PLANS = 4;

        public PlanService(
            IPlanRepository planRepository,
            ISubscriptionRepository subscriptionRepository,
            ILogger<PlanService> logger)
        {
            _planRepository = planRepository;
            _subscriptionRepository = subscriptionRepository;
            _logger = logger;

        }

        public async Task AddAsync(Plan plan)
        {
            if (plan.EAtivo)
            {
                var activePlans = await _planRepository.GetActivePlansAsync();
                if (activePlans.Count() >= MAX_ACTIVE_PLANS)
                {
                    _logger.LogWarning("Tentativa de adicionar um novo plano ativo, mas o limite de {MaxPlans} já foi atingido.", MAX_ACTIVE_PLANS);
                    throw new InvalidOperationException($"Não é possível adicionar um novo plano ativo. O limite de {MAX_ACTIVE_PLANS} planos ativos já foi atingido.");
                }
            }

            var existingByName = await _planRepository.GetPlanByNameAsync(plan.NomePlano);
            if (existingByName != null)
            {
                throw new InvalidOperationException("Já existe um plano com este nome.");
            }

            await _planRepository.AddAsync(plan);
            _logger.LogInformation("Novo plano ID: {PlanId} adicionado com sucesso.", plan.IdPlano);
        }

        public async Task UpdateAsync(Plan plan) 
        {
            var existingPlan = await _planRepository.GetByIdAsync(plan.IdPlano);

            if (existingPlan == null)
            {
                _logger.LogWarning("Tentativa de atualizar um plano inexistente. ID: {PlanId}", plan.IdPlano);
                throw new InvalidOperationException($"Plano com ID {plan.IdPlano} não encontrado.");
            }

            if (!existingPlan.EAtivo && plan.EAtivo)
            {
                _logger.LogInformation("Tentativa de reativar o plano ID: {PlanId}", plan.IdPlano);
                var activePlans = await _planRepository.GetActivePlansAsync();

                if (activePlans.Count() >= MAX_ACTIVE_PLANS)
                {
                    _logger.LogWarning("Falha ao reativar o plano ID: {PlanId}. Limite de {MaxPlans} planos ativos atingido.", plan.IdPlano, MAX_ACTIVE_PLANS);
                    throw new InvalidOperationException($"Não é possível reativar o plano. O limite de {MAX_ACTIVE_PLANS} planos ativos já foi atingido.");
                }
            }

            await _planRepository.UpdateAsync(plan);
            _logger.LogInformation("Plano ID: {PlanId} atualizado com sucesso.", plan.IdPlano);
        }

        // --- Implementação dos outros métodos da interface ---

        public async Task<Plan?> GetByIdAsync(int id)
        {
            return await _planRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Plan>> GetAllAsync()
        {
            return await _planRepository.GetAllAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var existingPlan = await _planRepository.GetByIdAsync(id);
            if (existingPlan == null)
            {
                _logger.LogWarning("Tentativa de deletar plano inexistente. ID: {PlanId}", id);
                throw new InvalidOperationException($"Plano com ID {id} não encontrado.");
            }

            int subscriptionsCount = await _subscriptionRepository.CountSubscriptionsByPlanAsync(id);

            if (subscriptionsCount > 0)
            {
                _logger.LogWarning("Tentativa de deletar plano ID: {PlanId} falhou. O plano possui {SubscriptionCount} assinaturas.", id, subscriptionsCount);

                throw new InvalidOperationException($"Não é possível deletar o plano (ID: {id}), pois ele está vinculado a {subscriptionsCount} assinaturas. Considere desativar o plano.");
            }

            await _planRepository.DeleteAsync(id);
            _logger.LogInformation("Plano ID: {PlanId} deletado com sucesso.", id);
        }

        public async Task<IEnumerable<Plan>> GetActivePlansAsync()
        {
            return await _planRepository.GetActivePlansAsync();
        }

        public async Task<Plan?> GetPlanByNameAsync(string name)
        {
            return await _planRepository.GetPlanByNameAsync(name);
        }
    }
}