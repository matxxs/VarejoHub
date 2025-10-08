using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VarejoHub.Domain.Entities;
using VarejoHub.Application.Interfaces.Services;


namespace VarejoHub.Application.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User user)
    {

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.IdUsuario.ToString()),
            new(ClaimTypes.Role, user.NivelAcesso),
            
            new("IsGlobalAdmin", user.EGlobalAdmin.ToString()),
            new("SupermarketId", user.IdSupermercado.HasValue ? user.IdSupermercado.Value.ToString() : "N/A"),
            
            new("SupermarketStatus", user.Supermercado?.Status ?? "GLOBAL") 
        };

        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:SecretKey"] ??
                                         throw new InvalidOperationException("JwtSettings:SecretKey não configurada."));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),

            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            ),
            Issuer = _configuration["JwtSettings:Issuer"],
            Audience = _configuration["JwtSettings:Audience"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}