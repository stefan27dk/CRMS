using CRMS.Client.ReactRedux.DB;
using CRMS.Client.ReactRedux.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.NotificationMailsServices
{
    public class NotificationMailsService : INotificationMailsService
    {
        private readonly IItlCrmsDbContext _itlCrmsDbContext;


        // Constructor
        public NotificationMailsService(IItlCrmsDbContext itlCrmsDbContext)
        {
            _itlCrmsDbContext = itlCrmsDbContext;
        }



        // Create Notification Mail ---------------------------------------------------------------------------------------------------------------------------- 
        public async Task<int> AddNotificationMail(NotificationMailsModel mail)
        {
            await _itlCrmsDbContext.Set<NotificationMailsModel>().AddAsync(mail);

            // If Saved
            if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
            {
                return 1;
            }
            return 0;
        }



         // Get All Mails -----------------------------------------------------------
        public async Task<List<NotificationMailsModel>> GetAllNotificationMails()
        {
            return await _itlCrmsDbContext.Set<NotificationMailsModel>().ToListAsync();
        }



        // Get Mail By ID -----------------------------------------------------------
        public async Task<NotificationMailsModel> GetNotificationMailByID(int mailId)
        {
            return await _itlCrmsDbContext.Set<NotificationMailsModel>().FirstOrDefaultAsync(m => m.Id == mailId);
        }


        // Get Mail By Email -----------------------------------------------------------
        public async Task<NotificationMailsModel> GetNotificationMailByEmail(string emailName)
        {
            return await _itlCrmsDbContext.Set<NotificationMailsModel>().FirstOrDefaultAsync(m => m.Email == emailName);
        }




        // Delete ById ----------------------------------------------------------------------------------------------------------------------------- 
        public async Task<int> DeleteNotificationMailByID(int mailId)
        {
            var mail_exists = await _itlCrmsDbContext.Set<NotificationMailsModel>().FirstOrDefaultAsync(m => m.Id == mailId);

            if (mail_exists != null)
            {
                _itlCrmsDbContext.Set<NotificationMailsModel>().Remove(mail_exists);

                // If Save OK
                if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
                {
                    return 1;
                }
                return 0;
            }
            return -1;
        }






        // Delete By Email Name----------------------------------------------------------------------------------------------------------------------------- 
        public async Task<int> DeleteNotificationMailByEmail(string emailName)
        {
            var mail_exists = await _itlCrmsDbContext.Set<NotificationMailsModel>().FirstOrDefaultAsync(m => m.Email == emailName);

            if (mail_exists != null)
            {
                _itlCrmsDbContext.Set<NotificationMailsModel>().Remove(mail_exists);

                // If Save OK
                if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
                {
                    return 1;
                }
                return 0;
            }
            return -1;
        }





        // Update - NotificationMail ---------------------------------------------------------------------------------------------------------------------------- 
        public async Task<int> UpdateNotificationMail(NotificationMailsModel mail)
        {
            var mail_exists = await _itlCrmsDbContext.Set<NotificationMailsModel>().FirstOrDefaultAsync(m => m.Id == mail.Id);

            // If Exists in the DB Update it
            if (mail_exists != null)
            {
                _itlCrmsDbContext.Entry(mail_exists).CurrentValues.SetValues(mail);  // Update / Replace Values

                // Save OK
                if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
                {
                    return 1;
                }
                return 0;
            }
            return -1;
        }
            
    }
}
