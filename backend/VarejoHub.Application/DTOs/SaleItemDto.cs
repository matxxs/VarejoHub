namespace VarejoHub.Application.DTOs
{
    public class SaleItemDto
    {
        public int IdItemVenda { get; set; }
        public int IdVenda { get; set; }
        public int IdProduto { get; set; }
        public decimal Quantidade { get; set; }
        public decimal PrecoUnitario { get; set; }
        public decimal Subtotal { get; set; }
        public string? NomeProduto { get; set; }
    }
}
