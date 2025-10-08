using System.ComponentModel.DataAnnotations;

namespace VarejoHub.Application.DTOs;

public class EmailRequest
{
    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")]
    public string Email { get; set; } = string.Empty;
}