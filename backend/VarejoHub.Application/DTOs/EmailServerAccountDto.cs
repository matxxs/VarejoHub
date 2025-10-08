namespace VarejoHub.Application.DTOs;

public class EmailServerAccountDto
{
    public string OriginEmail { get; set; } = string.Empty;
    public string OriginName { get; set; } = string.Empty;
        
    public string Server { get; set; } = string.Empty;
    public int Port { get; set; }
    public string User { get; set; } = string.Empty;
    public string Pass { get; set; } = string.Empty;
    public string Return { get; set; } = string.Empty;

    public Boolean Authentic { get; set; }
    public Boolean Active { get; set; }
    public string EmailDebung { get; set; } = string.Empty;
}