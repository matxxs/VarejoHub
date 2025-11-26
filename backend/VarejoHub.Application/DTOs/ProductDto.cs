namespace VarejoHub.Application.DTOs
{
    public class ProductDto
    {
        public int IdProduto { get; set; }
        public int IdSupermercado { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string? CodigoBarras { get; set; }
        public decimal PrecoVenda { get; set; }
        public decimal? PrecoCusto { get; set; }
        public decimal EstoqueAtual { get; set; }
        public decimal? AlertaBaixoEstoque { get; set; }
        public string? Unidade { get; set; }
    }
}
