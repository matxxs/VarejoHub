using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}
