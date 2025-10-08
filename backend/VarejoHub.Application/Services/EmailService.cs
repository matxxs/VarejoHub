using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using VarejoHub.Application.DTOs;
using VarejoHub.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace VarejoHub.Application.Services;

public class EmailService : IEmailService
{
    private readonly EmailServerAccountDto _account;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IOptions<EmailServerAccountDto> accountOptions, ILogger<EmailService> logger)
    {
        _account = accountOptions.Value ?? throw new ArgumentNullException(nameof(accountOptions), "A configuração da conta de e-mail não pode ser nula.");
        _logger = logger;
    }

    public async Task<Result> SendEmailAsync(string[] to, string[] emailcc, string subject, string body, string[] attachments)
    {
        if (to == null || to.Length == 0 || string.IsNullOrEmpty(to[0]))
        {
            const string errorMsg = "O e-mail de destino é obrigatório.";
            _logger.LogWarning(errorMsg);
            return Result.Fail(errorMsg + "VALIDATION_ERROR");
        }

        if (!_account.Active)
        {
            _logger.LogInformation("Serviço de e-mail inativo.");
            System.Diagnostics.Debug.WriteLine("Serviço de e-mail inativo. E-mail não enviado.");
            return Result.Ok();
        }

        using (MailMessage mailMessage = new MailMessage())
        {
            mailMessage.From = new MailAddress(_account.OriginEmail, _account.OriginName);

            if (!string.IsNullOrEmpty(_account.Return))
            {
                mailMessage.ReplyToList.Add(new MailAddress(_account.Return));
            }

            if (!string.IsNullOrEmpty(_account.EmailDebung))
            {
                mailMessage.To.Add(new MailAddress(_account.EmailDebung));
            }
            else
            {
                AddEmails(mailMessage.To, to);
                AddEmails(mailMessage.Bcc, emailcc);
            }

            AddAttachament(mailMessage, attachments);
            mailMessage.Priority = MailPriority.Normal;
            mailMessage.IsBodyHtml = true;
            mailMessage.Subject = subject;
            mailMessage.Body = body;

            using (SmtpClient client = new SmtpClient())
            {
                client.Port = _account.Port;
                client.Host = _account.Server;
                client.EnableSsl = _account.Authentic;
                client.DeliveryMethod = SmtpDeliveryMethod.Network;

                if (_account.Authentic)
                {
                    client.UseDefaultCredentials = false;
                    client.Credentials = new NetworkCredential(_account.User, _account.Pass);
                }
                else
                {
                    client.UseDefaultCredentials = true;
                }

                try
                {
                    await client.SendMailAsync(mailMessage);
                    return Result.Ok();
                }
                catch (SmtpFailedRecipientsException ex)
                {
                    var failed = string.Join(", ", ex.InnerExceptions.Select(e => e.FailedRecipient));
                    var msg = $"Falha ao enviar e-mail para alguns destinatários: {failed}.";
                    _logger.LogError(ex, msg);
                    return Result.Fail(msg + "SMTP_RECIPIENTS_FAILED");
                }
                catch (SmtpException ex)
                {
                    var msg = $"Erro no servidor SMTP. Código: {ex.StatusCode}. Mensagem: {ex.Message}";
                    _logger.LogError(ex, msg);
                    return Result.Fail(msg + "SMTP_SERVER_ERROR");
                }
                catch (Exception ex)
                {
                    var msg = $"Erro inesperado ao tentar enviar e-mail. Destino: {mailMessage.To}.";
                    _logger.LogError(ex, msg);
                    return Result.Fail(msg + "UNEXPECTED_EMAIL_ERROR");
                }
            }
        }
    }

    private static void AddEmails(MailAddressCollection recipients, string[] emailLists)
    {
        if (emailLists == null) return;

        foreach (var emailString in emailLists)
        {
            if (string.IsNullOrEmpty(emailString)) continue;

            string[] emailSplited = emailString.Split(new char[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries);

            foreach (string email in emailSplited)
            {
                string trimmedEmail = email.Trim();
                if (string.IsNullOrEmpty(trimmedEmail)) continue;

                try
                {
                    recipients.Add(new MailAddress(trimmedEmail));
                }
                catch (FormatException)
                {
                    System.Diagnostics.Debug.WriteLine($"E-mail inválido ignorado: {trimmedEmail}");
                }
            }
        }
    }

    private static void AddAttachament(MailMessage message, string[] attachments)
    {
        if (attachments == null || attachments.Length == 0) return;

        foreach (string file in attachments)
        {
            if (string.IsNullOrEmpty(file) || !System.IO.File.Exists(file)) continue;

            try
            {
                Attachment data = new Attachment(file, MediaTypeNames.Application.Octet);
                data.Name = System.IO.Path.GetFileName(file);

                ContentDisposition disposition = data.ContentDisposition;
                disposition.CreationDate = System.IO.File.GetCreationTime(file);
                disposition.ModificationDate = System.IO.File.GetLastWriteTime(file);

                disposition.ReadDate = System.IO.File.GetLastWriteTime(file);

                message.Attachments.Add(data);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Erro ao anexar o arquivo {file}: {ex.Message}");
            }
        }
    }
}