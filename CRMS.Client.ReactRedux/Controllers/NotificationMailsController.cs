using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Services.NotificationMailsServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]        
    [ApiController]
    public class NotificationMailsController : ControllerBase
    {
        private readonly INotificationMailsService _notificationMailsService;
      

        // Constructor
        public NotificationMailsController(INotificationMailsService notificationMailsService)
        {
           _notificationMailsService = notificationMailsService;
        }





        // Create Notification Mail ---------------------------------------------------------------------------------------------------------------------------- 
        [HttpPost]
        [Route("AddNotificationMail")]
        public async Task<IActionResult> AddNotificationMail(NotificationMailsModel mail)
        {
            if(mail.Validate())
            {   
                var mail_added = await _notificationMailsService.AddNotificationMail(mail);
               
                if(mail_added == 1)
                {
                    return StatusCode(201, await GetAllNotificationMails());
                }
                 return StatusCode(201, $"Server fejl - Email: {mail.Email} blev ikke oprettet!");
            }
            return StatusCode(400, $"Invalid Input! - {mail.Email}");
        }



        // Get All Mails -----------------------------------------------------------
        [HttpGet]
        [Route("GetAllNotificationMails")]
        public async Task<List<NotificationMailsModel>> GetAllNotificationMails()
        {
            return await _notificationMailsService.GetAllNotificationMails();  
        }




        // Get Mail By ID -----------------------------------------------------------
        [HttpGet]
        [Route("GetNotificationMailByID")]
        public async Task<NotificationMailsModel> GetNotificationMailByID(int mailId)
        {
          return await _notificationMailsService.GetNotificationMailByID(mailId);  
        }




        // Get Mail By Email -----------------------------------------------------------
        [HttpGet]
        [Route("GetNotificationMailByEmail")]
        public async Task<NotificationMailsModel> GetNotificationMailByEmail(string emailName)
        {
            return await _notificationMailsService.GetNotificationMailByEmail(emailName);
        }



        // Delete ById ----------------------------------------------------------------------------------------------------------------------------- 
        [HttpDelete]
        [Route("DeleteNotificationMailByID")]
        public async Task<IActionResult> DeleteNotificationMailByID(int mailId)
        {
           var mail_deleted = await _notificationMailsService.DeleteNotificationMailByID(mailId);


            if (mail_deleted == 1)
            {
                return StatusCode(200, await GetAllNotificationMails()); 
            }
            else if(mail_deleted == -1)
            {
                return StatusCode(200, $"Email med ID: {mailId} eksiter ikke!");
            }
            return StatusCode(200, $"Server Fejl - Email med ID: {mailId} blev ikke slettet!");
        }





        // Delete By Email Name----------------------------------------------------------------------------------------------------------------------------- 
        [HttpDelete]
        [Route("DeleteNotificationMailByEmail")]
        public async Task<IActionResult> DeleteNotificationMailByEmail(string emailName)
        {
            if(!string.IsNullOrWhiteSpace(emailName))
            {   
               var mail_deleted = await _notificationMailsService.DeleteNotificationMailByEmail(emailName);
               
               if (mail_deleted == 1)
               {
                   return StatusCode(200, await GetAllNotificationMails());
               }
               else if (mail_deleted == -1)
               {
                   return StatusCode(200, $"Email: {emailName} eksiter ikke!");
               }
               return StatusCode(200, $"Server Fejl - Email: {emailName} blev ikke Slettet!");
            }
            return StatusCode(400, $"Invalid Input!");
        }




        // Update - NotificationMail ---------------------------------------------------------------------------------------------------------------------------- 
        [HttpPut]
        [Route("UpdateNotificationMail")]
        public async Task<IActionResult> UpdateNotificationMail(NotificationMailsModel mail)
        {
            if(mail.Validate())
            {  
              var mail_updated = await _notificationMailsService.UpdateNotificationMail(mail);
              if(mail_updated == 1)
              {
                   return StatusCode(200, await GetAllNotificationMails ());
              }
              else if (mail_updated == -1)
              {
                  return StatusCode(200, $"Email: {mail.Email} eksiter ikke!");
              }
                return StatusCode(200, $"Server Fejl - Email:  {mail.Email} blev ikke Opdateret!");
            }
            return StatusCode(400, $"Invalid Input!");
        }
    }
}
