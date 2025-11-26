namespace VarejoHub.Application.DTOs
{
    public class SupplierDto
    {
        public int IdFornecedor { get; set; }
        public int IdSupermercado { get; set; }
        public string NomeFantasia { get; set; } = string.Empty;
        public string? Cnpj { get; set; }
        public string? Email { get; set; }
        public string? Telefone { get; set; }
    }
}
