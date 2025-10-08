namespace VarejoHub.Application.DTOs;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string Mensagem { get; set; } = "Login realizado com sucesso.";
}