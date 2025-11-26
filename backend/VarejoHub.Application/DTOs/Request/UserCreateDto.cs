using System.ComponentModel.DataAnnotations;


namespace VarejoHub.Application.DTOs.Request
{
    public class UserCreateDto
    {
        // IdSupermercado é obrigatório, pois EGlobalAdmin será 'false' por padrão.
        [Required(ErrorMessage = "O ID do supermercado é obrigatório.")]
        [Range(1, int.MaxValue, ErrorMessage = "ID do supermercado inválido.")]
        public int IdSupermercado { get; set; }

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [MaxLength(100, ErrorMessage = "O e-mail não pode exceder 100 caracteres.")]
        [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "O nome é obrigatório.")]
        [MaxLength(100, ErrorMessage = "O nome não pode exceder 100 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "O nível de acesso é obrigatório.")]
        [RegularExpression("^(Administrador|Gerente|Caixa|Financeiro)$",
            ErrorMessage = "Nível de acesso inválido. Use 'Administrador', 'Gerente', 'Caixa' ou 'Financeiro'.")]
        public string NivelAcesso { get; set; } = string.Empty;
    }

}
