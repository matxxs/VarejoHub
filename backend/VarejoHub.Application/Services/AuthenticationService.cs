using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using VarejoHub.Application.DTOs;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Services;


public class AuthenticationService : IAuthenticationService
{
    private readonly ISupermarketRepository _supermarketRepository;
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly ITokenService _jwtService;
    private readonly IFileProvider _fileProvider;
    private readonly ILogger<AuthenticationService> _logger;

    public AuthenticationService(
        ISupermarketRepository supermarketRepository,
        IUserRepository userRepository,
        IEmailService emailService,
        ITokenService jwtService,
        Microsoft.AspNetCore.Hosting.IWebHostEnvironment env,
        ILogger<AuthenticationService> logger)
    {
        _supermarketRepository = supermarketRepository;
        _userRepository = userRepository;
        _emailService = emailService;
        _jwtService = jwtService;
        _fileProvider = env.ContentRootFileProvider;
        _logger = logger;
    }

    private const int TokenExpirationMinutes = 15;
    private const int RegistrationTokenExpirationHours = 24;

    public async Task<Result<string>> LoginAsync(string email, string token)
    {
        _logger.LogInformation("Attempting login for user {Email}", email);

        var user = await _userRepository.GetByEmailAsync(email);

        if (user is null)
        {
            _logger.LogWarning("Login failed for {Email}: User not found.", email);
            return Result<string>.FailT("Credenciais inválidas ou link expirado.");
        }

        Supermarket? supermarket = null;

        if (!user.EGlobalAdmin)
        {
            var supermarketId = user.IdSupermercado.GetValueOrDefault();

            supermarket = await _supermarketRepository.GetByIdAsync(supermarketId);
            if (supermarket is null)
            {
                _logger.LogWarning("Login failed for {Email}: Supermarket ID {SupermarketId} not found.", email, supermarketId);
                return Result<string>.FailT("Supermercado não encontrado.");
            }

            // Tempo de acesso 14 dias
            if (supermarket.Assinatura.StatusAssinatura == "Trial")
            {
                var diasDesdeAdesao = (DateTime.UtcNow - supermarket.DataAdesao).TotalDays;
                if (diasDesdeAdesao > 14)
                {
                    _logger.LogWarning("Login failed for {Email}: Trial period expired.", email);
                    return Result<string>.FailT("O período de teste grátis expirou. Por favor, entre em contato com o suporte.");
                }
            }

            if(supermarket.Assinatura.StatusAssinatura == "Inadimplente" || 
                supermarket.Assinatura.StatusAssinatura == "Cancelada" ||
                supermarket.Assinatura.StatusAssinatura == "Bloqueada")
            {
                _logger.LogWarning("Login failed for {Email}: Supermarket subscription status is {Status}.", email, supermarket.Assinatura.StatusAssinatura);
                return Result<string>.FailT("O acesso ao sistema está bloqueado devido ao status da assinatura do supermercado. Por favor, entre em contato com o suporte.");
            }
        }

        if (user.TokenAcessoTemporario != token)
        {
            _logger.LogWarning("Login failed for {Email}: Token mismatch.", email);
            return Result<string>.FailT("Token de acesso incorreto.");
        }

        if (user.DataExpiracaoToken.HasValue && user.DataExpiracaoToken.Value < DateTime.UtcNow)
        {
            _logger.LogWarning("Login failed for {Email}: Token expired at {ExpirationDate}.", email, user.DataExpiracaoToken.Value);
            return Result<string>.FailT("O link de acesso temporário expirou.");
        }

        var jwtToken = _jwtService.GenerateToken(user, supermarket);

        user.TokenAcessoTemporario = null;
        user.DataExpiracaoToken = null;
        user.Confirmado = true;
        await _userRepository.UpdateAsync(user);

        _logger.LogInformation("Successful login and JWT generated for user {Email}", email);

        return Result<string>.Ok(jwtToken);
    }

    public async Task<Result> RegisterAsync(Supermarket supermarket, User user)
    {
        if (await _supermarketRepository.CnpjExistsAsync(supermarket.Cnpj))
        {
            return Result.Fail("Um supermercado com este CNPJ já está cadastrado.");
        }

        if (await _userRepository.GetByEmailAsync(user.Email) is not null)
        {
            return Result.Fail("Este e-mail já está em uso.");
        }

        try
        {
            supermarket.Assinatura.DataInicioVigencia = DateOnly.FromDateTime(DateTime.Now);
            supermarket.Assinatura.DataProximoVencimento = DateOnly.FromDateTime(DateTime.Now.AddDays(14));
            supermarket.Assinatura.StatusAssinatura = "Trial";

            supermarket.DataAdesao = DateTime.Now;

            await _supermarketRepository.AddAsync(supermarket);

            user.IdSupermercado = supermarket.IdSupermercado;
            user.NivelAcesso = "Administrador";
            user.EGlobalAdmin = false;
            user.Confirmado = false;

            var token = GenerateSecureToken();
            user.TokenAcessoTemporario = token;
            user.DataExpiracaoToken = DateTime.UtcNow.AddHours(RegistrationTokenExpirationHours);

            await _userRepository.AddAsync(user);

            await SendRegistrationMagicLink(user.Email, token);

            _logger.LogInformation("New Supermarket and Admin User registered for {Cnpj} with Admin Email {Email}", supermarket.Cnpj, user.Email);

            return Result.Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Registration failed for Supermarket {Cnpj}", supermarket.Cnpj);
            // Optionally, implement compensating transaction logic here (e.g., delete supermarket/user if one save failed)
            return Result.Fail($"Erro interno ao registrar: {ex.Message}");
        }
    }



    /// <summary>
    /// Generates a temporary access token and sends the Magic Link email.
    /// </summary>
    public async Task<Result> GenerateTemporaryAccessLink(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        if (user is null) 
            return Result.Fail("Credenciais inválidas.");

        var token = GenerateSecureToken();
        var dataExpiracao = DateTime.UtcNow.AddMinutes(TokenExpirationMinutes);

        user.TokenAcessoTemporario = token;
        user.DataExpiracaoToken = dataExpiracao;
        await _userRepository.UpdateAsync(user);

        Supermarket? supermarket = user.IdSupermercado.HasValue
            ? await _supermarketRepository.GetByIdAsync(user.IdSupermercado.Value)
            : null;

        await SendLoginMagicLink(email, token, user, supermarket);

        return Result.Ok();
    }


    private async Task SendLoginMagicLink(string email, string token, User user, Supermarket? supermarket)
    {
        var supermarketName = supermarket?.NomeFantasia ?? "Administrador Global";
        var status = supermarket?.Assinatura?.StatusAssinatura ?? "Global";

        var magicLinkUrl = $"http://localhost:5054/api/auth/magic-login?token={token}&email={email}";

        var htmlContent = await GetTemplateContent("email-login-template.html");

        var finalHtml = htmlContent
            .Replace("{{ADMIN_EMAIL}}", user.Email)
            .Replace("{{ADMIN_NAME}}", user.Nome)
            .Replace("{{LOGIN_URL}}", magicLinkUrl)
            .Replace("{{SUPERMARKET_NAME}}", supermarketName)
            .Replace("{{STATUS}}", HtmlStatus(status));

        await _emailService.SendEmailAsync(
            to: new[] { email },
            emailcc: null!,
            subject: "Seu Link de Acesso ao VarejoHub",
            body: finalHtml,
            attachments: null!
        );
    }

    private async Task SendRegistrationMagicLink(string email, string token)
    {
        var magicLinkUrl = $"http://localhost:5054/api/auth/confirm-registration?token={token}&email={email}";

        var htmlContent = await GetTemplateContent("email-register-template.html");

        var finalHtml = htmlContent.Replace("{{MAGIC_LINK_URL}}", magicLinkUrl);

        await _emailService.SendEmailAsync(
            to: new[] { email },
            emailcc: null!,
            subject: "Bem-vindo ao VarejoHub - Confirme Seu E-mail",
            body: finalHtml,
            attachments: null!
        );
    }

    private static string HtmlStatus(string status)
    {
        return status switch
        {
            "Trial" => "<span style=\"display: inline-block; padding: 4px 12px; background-color: #10b981; color: #ffffff; font-size: 12px; font-weight: 600; border-radius: 12px;\">Ativo - Teste Grátis</span>",
            "Ativa" => "<span style=\"display: inline-block; padding: 4px 12px; background-color: #2563eb; color: #ffffff; font-size: 12px; font-weight: 600; border-radius: 12px;\">Ativo</span>",
            "Suspenso" => "<span style=\"display: inline-block; padding: 4px 12px; background-color: #ef4444; color: #ffffff; font-size: 12px; font-weight: 600; border-radius: 12px;\">Suspenso</span>",
            "Global" => "<span style=\"display: inline-block; padding: 4px 12px; background-color: #a855f7; color: #ffffff; font-size: 12px; font-weight: 600; border-radius: 12px;\">Admin Global</span>",
            _ => string.Empty
        };
    }

    private static string GenerateSecureToken()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray())
                      .Replace("=", "")
                      .Replace("+", "-")
                      .Replace("/", "_");
    }




    private async Task<string> GetTemplateContent(string templateFileName)
    {
        var currentDirectory = Directory.GetCurrentDirectory();

        var fullPath = Path.Combine(currentDirectory, "Templates", templateFileName);

        if (!File.Exists(fullPath))
        {
            throw new FileNotFoundException($"Template '{templateFileName}' não encontrado no caminho esperado: {fullPath}");
        }

        return await File.ReadAllTextAsync(fullPath);
    }
}

