using CRMS.Client.ReactRedux.Frame.EmailService;
using System.Text.Json;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.ConfigurationServices
{
    public interface IAppsettingsConfigurationService
    {
        Task<string> GenerateInvoiceTokenAsync();
        Task<JsonElement> GetCvrApiAddressAsync();
        Task<string> GetDbConStringAsync();
        Task<string> GetInvoiceTokenAsync();
        Task<int> GetNotificationDaysAsync();
        Task<JsonElement> GetServerEmailSettingsAsync();
        Task<int> SetCvrApiAddressAsync(string cvrApiAddress);
        Task<int> SetDbConStringAsync(string conString);
        Task<int> SetInvoiceTokenAsync(string token);
        Task<int> SetNotificationDaysAsync(int notificationDays);
        Task<int> SetServerEmailSettingsAsync(EmailServiceConfig emailSettingsObj);
    }
}