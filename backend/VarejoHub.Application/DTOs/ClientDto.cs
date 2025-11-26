namespace VarejoHub.Application.DTOs
{
    public class ClientDto
    {
        public int IdCliente { get; set; }
        public int IdSupermercado { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Cpf { get; set; }
        public string? Email { get; set; }
        public int PontosFidelidade { get; set; }
    }
}
