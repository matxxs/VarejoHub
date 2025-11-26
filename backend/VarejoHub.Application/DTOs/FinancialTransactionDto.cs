namespace VarejoHub.Application.DTOs
{
    public class FinancialTransactionDto
    {
        public int IdTransacao { get; set; }
        public int IdSupermercado { get; set; }
        public string TipoTransacao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public DateTime DataHora { get; set; }
        public string? Descricao { get; set; }
        public string? Categoria { get; set; }
    }
}
