namespace VarejoHub.Application.DTOs
{
    public class UserDto
    {
        public int IdUsuario { get; set; }
        public string Email { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string NivelAcesso { get; set; } = string.Empty;
        public bool EGlobalAdmin { get; set; }

        /// <summary>
        /// Dados básicos do supermercado associado ao usuário.
        /// </summary>
        public SupermarketDto? Supermercado { get; set; }
    }
}
