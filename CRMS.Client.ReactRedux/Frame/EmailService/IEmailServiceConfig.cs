namespace CRMS.Client.ReactRedux.Frame.EmailService
{
    public interface IEmailServiceConfig
    {
        string From { get; set; }
        string Password { get; set; }
        int Port { get; set; }
        string SmtpServer { get; set; }
        string Username { get; set; }
    }
}