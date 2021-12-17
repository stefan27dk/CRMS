using CRMS.Client.ReactRedux.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.EmailServices
{
    public interface IEmailService
    {
        Task<string> BuildNotificationMessage(List<SubscriptionsModel> subscriptions, List<CustomerModel> customers, List<ProductModel> products);
        Task SendMail(string receiver, string subject, string content, int countSubscriptions, string extraContent);
        Task SendRawMail(string receiver, string subject, string content);
        Task<int> SendResponseMailInvoicesSend();
        Task<int> SendToAllMails();
    }
}