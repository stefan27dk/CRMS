using CRMS.Client.ReactRedux.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.NotificationMailsServices
{
    public interface INotificationMailsService
    {
        Task<int> AddNotificationMail(NotificationMailsModel mail);
        Task<int> DeleteNotificationMailByEmail(string emailName);
        Task<int> DeleteNotificationMailByID(int mailId);
        Task<List<NotificationMailsModel>> GetAllNotificationMails();
        Task<NotificationMailsModel> GetNotificationMailByID(int mailId);
        Task<NotificationMailsModel> GetNotificationMailByEmail(string emailName);
        Task<int> UpdateNotificationMail(NotificationMailsModel mail);
    }
}