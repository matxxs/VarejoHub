using VarejoHub.Application.DTOs;
using VarejoHub.Application.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Interfaces.Services;

public interface IAuthenticationService
{

    /// <summary>
    /// Validates the temporary access token for login.
    /// </summary>
    /// <param name="email">The user's email.</param>
    /// <param name="token">The temporary access token (Magic Link token).</param>
    Task<Result<string>> LoginAsync(string email, string token);

    /// <summary>
    /// Registers a new Supermarket and its initial Admin User.
    /// </summary>
    /// <param name="supermarket">The Supermarket entity to register.</param>
    /// <param name="user">The initial User entity (Admin) for the Supermarket.</param>
   Task<Result> RegisterAsync(Supermarket supermarket, User user);

    /// <summary>
    /// Generates a temporary access token and sends the Magic Link email.
    /// </summary>
    /// 
    Task<Result> GenerateTemporaryAccessLink(string email);
}
