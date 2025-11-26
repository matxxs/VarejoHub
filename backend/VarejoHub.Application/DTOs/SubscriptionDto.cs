namespace VarejoHub.Application.DTOs
{
    public class SubscriptionDto
    {
        public int IdAssinatura { get; set; }
        public int IdSupermercado { get; set; }
        public int IdPlano { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public string StatusAssinatura { get; set; } = string.Empty;
        public string? NomePlano { get; set; }
    }
}
