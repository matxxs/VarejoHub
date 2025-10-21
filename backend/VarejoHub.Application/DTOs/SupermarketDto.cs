namespace VarejoHub.Application.DTOs;

public class SupermarketDto
{
    public int IdSupermercado { get; set; }
    public string NomeFantasia { get; set; } = string.Empty;
    public PlanoDto? Plano { get; set; }
}
