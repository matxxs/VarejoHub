using VarejoHub.Application.DTOs;

namespace VarejoHub.Application.Interfaces.Services;

public interface IEmailService
{
    Task<Result> SendEmailAsync(string[] to, string[] emailcc, string subject, string body, string[] attachments);
}
