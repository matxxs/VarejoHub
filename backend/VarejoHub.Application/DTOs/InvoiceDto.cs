namespace VarejoHub.Application.DTOs
{
    public class InvoiceDto
    {
        public int IdFatura { get; set; }
        public int IdAssinatura { get; set; }
        public int IdSupermercado { get; set; }
        public DateTime DataEmissao { get; set; }
        public DateTime DataVencimento { get; set; }
        public decimal ValorTotal { get; set; }
        public string StatusPagamento { get; set; } = string.Empty;
        public DateTime? DataPagamento { get; set; }
    }
}
