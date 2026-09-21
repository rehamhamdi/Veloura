using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using Veloura.Application.Interfaces;

namespace Veloura.Infrastructure.Email;

public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public SmtpEmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendOtpEmailAsync(string toEmail, string otpCode, CancellationToken cancellationToken = default)
    {
        var smtp = _configuration.GetSection("Smtp");

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(smtp["FromName"], smtp["Username"]));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = "Your Veloura Password Reset Code";

message.Body = new TextPart("html")
{
    Text = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
</head>

<body style='margin:0; padding:0; background-color:#f7f5f2; font-family:Arial, Helvetica, sans-serif;'>

    <div style='max-width:600px; margin:40px auto; padding:20px;'>

        <!-- Main Card -->
        <div style='background-color:#ffffff; border-radius:16px; padding:40px 35px; 
                    box-shadow:0 4px 20px rgba(0,0,0,0.06);'>

            <!-- Logo / Brand -->
            <div style='text-align:center; margin-bottom:30px;'>
                <h1 style='margin:0; color:#8b6f47; font-size:32px; 
                           letter-spacing:2px;'>
                    VELOURA
                </h1>

                <p style='margin:8px 0 0; color:#999999; font-size:13px;'>
                    Beauty & Care
                </p>
            </div>

            <!-- Title -->
            <div style='text-align:center;'>
                <h2 style='color:#333333; margin-bottom:12px;'>
                    Reset Your Password
                </h2>

                <p style='color:#666666; font-size:15px; line-height:1.6;'>
                    We received a request to reset your Veloura account password.
                    Use the verification code below to continue.
                </p>
            </div>

            <!-- OTP Box -->
            <div style='background-color:#f8f3ed; border-radius:12px; 
                        padding:25px; margin:30px 0; text-align:center;'>

                <p style='margin:0 0 10px; color:#777777; font-size:13px;'>
                    Your verification code
                </p>

                <div style='font-size:36px; font-weight:bold; 
                            letter-spacing:8px; color:#8b6f47;'>
                    {otpCode}
                </div>

            </div>

            <!-- Expiration -->
            <div style='text-align:center;'>
                <p style='color:#777777; font-size:14px; line-height:1.6;'>
                    This code will expire in 
                    <strong style='color:#333333;'>10 minutes</strong>.
                </p>

                <p style='color:#999999; font-size:13px; line-height:1.6;'>
                    If you didn't request a password reset, you can safely
                    ignore this email.
                </p>
            </div>

            <!-- Divider -->
            <hr style='border:none; border-top:1px solid #eeeeee; margin:30px 0;'>

            <!-- Footer -->
            <div style='text-align:center;'>
                <p style='margin:0; color:#999999; font-size:12px;'>
                    © 2026 Veloura. All rights reserved.
                </p>

                <p style='margin:8px 0 0; color:#bbbbbb; font-size:11px;'>
                    This is an automated email. Please do not reply.
                </p>
            </div>

        </div>

    </div>

</body>
</html>"
};
        using var client = new SmtpClient();

        await client.ConnectAsync(
            smtp["Host"],
            int.Parse(smtp["Port"]!),
            SecureSocketOptions.StartTls,
            cancellationToken);

        await client.AuthenticateAsync(smtp["Username"], smtp["Password"], cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }
}