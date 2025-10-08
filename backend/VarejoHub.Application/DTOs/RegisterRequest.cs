using System.ComponentModel.DataAnnotations;

namespace VarejoHub.Application.DTOs;


public class RegisterRequest
{
    // Supermarket Data
    [Required(ErrorMessage = "O nome fantasia é obrigatório.")]
    [StringLength(100)]
    public string NomeFantasia { get; set; } = string.Empty;

    [Required(ErrorMessage = "A razão social é obrigatório.")]
    [StringLength(100)]
    public string RazaoSocial { get; set; } = string.Empty;

    [Required(ErrorMessage = "O CNPJ é obrigatório.")]
    [StringLength(14, MinimumLength = 14)]
    public string Cnpj { get; set; } = string.Empty;

    // User Data (Admin)
    [Required(ErrorMessage = "O nome do administrador é obrigatório.")]
    [StringLength(100)]
    public string NomeAdmin { get; set; } = string.Empty;

    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")]
    [StringLength(100)]
    public string EmailAdmin { get; set; } = string.Empty;
}