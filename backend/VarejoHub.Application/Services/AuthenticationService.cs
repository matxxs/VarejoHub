using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using VarejoHub.Application.DTOs;
using VarejoHub.Application.Interfaces.Repositories;
using VarejoHub.Application.Interfaces.Services;
using VarejoHub.Domain.Entities;

namespace VarejoHub.Application.Services;


public class LoginReponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = new();
    public SupermarketDto Supermarket { get; set; } = new();
}

public class UserDto
{
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string AcessLevel { get; set; } = string.Empty; 
    public bool GlobalAdmin { get; set; }                
}

public class SupermarketDto
{
    public int SupermarketId { get; set; }
    public string NameFantasy { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

//var response = new LoginReponse
//{   
//    Token = jwtToken,
//    User = new UserDto
//    {
//        Name = user.Nome,
//        Email = user.Email,
//        AcessLevel = user.NivelAcesso,
//        GlobalAdmin = user.EGlobalAdmin
//    },
//    Supermarket = user.EGlobalAdmin ? new SupermarketDto() : new SupermarketDto
//    {
//        SupermarketId = user.Supermercado?.IdSupermercado ?? 0,
//        NameFantasy = user.Supermercado?.NomeFantasia ?? "Administração Global",
//        Status = user.Supermercado?.Status ?? "GLOBAL"
//    }
//};

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

        var jwtToken = _jwtService.GenerateToken(user);

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
            supermarket.Status = "Trial";
            supermarket.DataInicioTrial = DateOnly.FromDateTime(DateTime.Now);
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
        var status = supermarket?.Status ?? "Global";

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
            "Ativo" => "<span style=\"display: inline-block; padding: 4px 12px; background-color: #2563eb; color: #ffffff; font-size: 12px; font-weight: 600; border-radius: 12px;\">Ativo</span>",
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

