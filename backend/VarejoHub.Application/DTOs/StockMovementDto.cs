namespace VarejoHub.Application.DTOs
{
    public class StockMovementDto
    {
        public int IdMovimentacao { get; set; }
        public int IdSupermercado { get; set; }
        public int IdProduto { get; set; }
        public string TipoMovimentacao { get; set; } = string.Empty;
        public decimal Quantidade { get; set; }
        public DateTime DataHora { get; set; }
        public string? NotaFiscalRef { get; set; }
        public string? NomeProduto { get; set; }
    }
}
