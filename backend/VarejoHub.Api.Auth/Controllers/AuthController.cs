using Microsoft.AspNetCore.Mvc;
using VarejoHub.Application.DTOs;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Api.Auth.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IAuthenticationService _authenticationService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IConfiguration configuration,
        IAuthenticationService authenticationService,
        ILogger<AuthController> logger)
    {
        _configuration = configuration;
        _authenticationService = authenticationService;
        _logger = logger;
    }

    /// <summary>
    /// Endpoint para registrar um novo Supermercado e seu primeiro Administrador.
    /// </summary>
    /// <param name="request">Dados do Supermercado e do Admin.</param>
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Result))]
    [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(Result))]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var supermarket = new Supermarket
        {
            NomeFantasia = request.NomeFantasia,
            RazaoSocial = request.RazaoSocial,
            Cnpj = request.Cnpj.Replace(".", "").Replace("/", "").Replace("-", "")
        };

        var user = new User
        {
            Nome = request.NomeAdmin,
            Email = request.EmailAdmin.ToLowerInvariant(),
            NivelAcesso = "Administrador",
            EGlobalAdmin = false,
            Confirmado = false
        };

        var result = await _authenticationService.RegisterAsync(supermarket, user);

        if (result.IsSuccess)
        {
            _logger.LogInformation("Registration successful for email: {Email}", request.EmailAdmin);
            return Ok(Result.Ok()); 
        }

        _logger.LogWarning("Registration failed: {Error}", result.Error);
        return Ok(Result.Fail(result.Error));
    }


    /// <summary>
    /// Endpoint para solicitar o Magic Link para login (ou para um novo link de confirmação).
    /// </summary>
    /// <param name="request">O e-mail do usuário.</param>
    [HttpPost("magic-link")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GenerateMagicLink([FromBody] EmailRequest request)
    {
        var result = await _authenticationService.GenerateTemporaryAccessLink(request.Email.ToLowerInvariant());

        if (result.IsSuccess)
        {
            _logger.LogInformation("Access attempt: {Email}", request.Email);
            return Ok(Result.Ok());
        }

        _logger.LogWarning("Access failed: {Error}", result.Error);
        return Ok(Result.Fail(result.Error));
    }

        /// <summary>
        /// Endpoint que o usuário acessa através do link enviado por e-mail (Callback).
        /// </summary>
        /// <param name="token">O token temporário (do link).</param>
        /// <param name="email">O e-mail do usuário (do link).</param>
        [HttpGet("magic-login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoginResponse))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> MagicLogin([FromQuery] string token, [FromQuery] string email)
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
            {
                return Unauthorized(new { Message = "Token ou e-mail ausentes." });
            }

            var result = await _authenticationService.LoginAsync(email.ToLowerInvariant(), token);

            var frontendBaseUrl = _configuration["AppSettings:FrontendBaseUrl"];

            if (result.IsSuccess)
            {
                _logger.LogInformation("User {Email} successfully authenticated via Magic Link.", email);

                var jwt = result.Value;

                var redirectUrl = $"{frontendBaseUrl}/auth/callback?jwt={jwt}";

                return Redirect(redirectUrl);
            }

            _logger.LogWarning("Magic Link failed for {Email}: {Error}", email, result.Error);

            var errorRedirectUrl = $"{frontendBaseUrl}/login?error=auth_failed";
            return Redirect(errorRedirectUrl);
        }
}
