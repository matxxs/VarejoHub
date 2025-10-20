using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _usuarioRepository;
        private readonly ISubscriptionRepository _subscriptionRepository;

        public UserService(IUserRepository usuarioRepository,
                              ISubscriptionRepository subscriptionRepository)
        {
            _usuarioRepository = usuarioRepository;
            _subscriptionRepository = subscriptionRepository;
        }

        /// <summary>
        /// Adiciona um novo usuário (funcionário), validando o limite do plano.
        /// </summary>
        public async Task AddAsync(User usuario)
        {
            if (usuario.IdSupermercado.HasValue && !usuario.EGlobalAdmin)
            {
                int supermarketId = usuario.IdSupermercado.Value;

                //signature
                var signature = await _subscriptionRepository.GetBySupermarketIdAsync(supermarketId);

                if (signature != null && signature.Plano.LimiteUsuarios.HasValue)
                {
                    // Busca a contagem atual de usuários
                    int currentCount = await _usuarioRepository.GetCountBySupermarketIdAsync(supermarketId);

                    if (currentCount >= signature.Plano.LimiteUsuarios.Value)
                    {
                        throw new System.Exception($"Limite de {signature.Plano.LimiteUsuarios.Value} usuários (funcionários) atingido para o seu plano.");
                    }
                }
            }

            await _usuarioRepository.AddAsync(usuario);
        }

        /// <summary>
        /// Atualiza um usuário (funcionário).
        /// </summary>
        public async Task UpdateAsync(User usuario)
        {
            await _usuarioRepository.UpdateAsync(usuario);
        }

        /// <summary>
        /// Deleta um usuário (funcionário).
        /// </summary>
        public async Task DeleteAsync(int id)
        {
            await _usuarioRepository.DeleteAsync(id);
        }

        public Task<User?> GetByIdAsync(int id)
        {
            return _usuarioRepository.GetByIdAsync(id);
        }

        public Task<IEnumerable<User>> GetAllBySupermarketIdAsync(int supermarketId)
        {
            return _usuarioRepository.GetAllBySupermarketIdAsync(supermarketId);
        }

        public Task<User?> GetByEmailAsync(string email)
        {
            return _usuarioRepository.GetByEmailAsync(email);
        }

        public Task<int> GetCountBySupermarketIdAsync(int supermarketId)
        {
            return _usuarioRepository.GetCountBySupermarketIdAsync(supermarketId);
        }
    }
}