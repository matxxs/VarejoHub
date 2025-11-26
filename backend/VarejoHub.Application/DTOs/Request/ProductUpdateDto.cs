using System.ComponentModel.DataAnnotations;

namespace VarejoHub.Application.DTOs.Request
{
    public class ProductUpdateDto
    {
        [Required(ErrorMessage = "O ID do produto é obrigatório.")]
        public int IdProduto { get; set; }

        [Required(ErrorMessage = "O ID do supermercado é obrigatório.")]
        public int IdSupermercado { get; set; }

        [MaxLength(20, ErrorMessage = "O código de barras não pode exceder 20 caracteres.")]
        public string? CodigoBarras { get; set; }

        [Required(ErrorMessage = "O nome do produto é obrigatório.")]
        [MaxLength(150, ErrorMessage = "O nome não pode exceder 150 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "A unidade de medida é obrigatória.")]
        [RegularExpression("^(UN|KG|L|PCT)$", ErrorMessage = "Unidade de medida inválida. Use 'UN', 'KG', 'L' ou 'PCT'.")]
        public string UnidadeMedida { get; set; } = string.Empty;

        [Required(ErrorMessage = "O estoque atual é obrigatório.")]
        [Range(0.0, (double)decimal.MaxValue, ErrorMessage = "O estoque atual não pode ser negativo.")]
        public decimal EstoqueAtual { get; set; }

        [Range(0.0, (double)decimal.MaxValue, ErrorMessage = "O preço de custo não pode ser negativo.")]
        public decimal? PrecoCusto { get; set; }

        [Required(ErrorMessage = "O preço de venda é obrigatório.")]
        [Range(0.01, (double)decimal.MaxValue, ErrorMessage = "O preço de venda deve ser positivo.")]
        public decimal PrecoVenda { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "O alerta de baixo estoque não pode ser negativo.")]
        public int AlertaBaixoEstoque { get; set; } = 5;
    }
}
