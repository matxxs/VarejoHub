namespace VarejoHub.Application.DTOs
{
    public class SaleDto
    {
        public int IdVenda { get; set; }
        public int IdSupermercado { get; set; }
        public int? IdUsuarioCaixa { get; set; }
        public int? IdCliente { get; set; }
        public DateTime DataHora { get; set; }
        public decimal ValorTotal { get; set; }
        public string? CupomFiscalNumero { get; set; }
        public List<SaleItemDto>? Itens { get; set; }
    }
}
