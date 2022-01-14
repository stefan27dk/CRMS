using CRMS.Client.ReactRedux.DB;
using CRMS.Client.ReactRedux.Frame.EmailService;
using CRMS.Client.ReactRedux.MiddleWares;
using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Services.ConfigurationServices;
using CRMS.Client.ReactRedux.Services.CustomersServices;
using CRMS.Client.ReactRedux.Services.NotificationMailsServices;
using CRMS.Client.ReactRedux.Services.ProductsServices;
using CRMS.Client.ReactRedux.Services.SubscriptionsServices;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.EmailServices
{
    public class EmailService : IEmailService
    {
        private readonly IEmailServiceConfig _emailServiceConfig;
        private readonly ISubscriptionsService _subscriptionsService;
        private readonly ICustomersService _customersService;
        private readonly IProductsService _productsService;
        private readonly INotificationMailsService _notificationMailsService;
        private readonly IConfiguration _configuration;
        private readonly IAppsettingsConfigurationService _appsettingsConfigurationService;
        private readonly IHttpContextAccessor _httpContextAccessor;



        // Constructor
        public EmailService(EmailServiceConfig emailServiceConfig,
            ISubscriptionsService subscriptionsService, ICustomersService customersService,
            IProductsService productsService, INotificationMailsService notificationMailsService,
            IConfiguration configuration, IAppsettingsConfigurationService appsettingsConfigurationService, 
            IHttpContextAccessor httpContextAccessor)
        {
            _emailServiceConfig = emailServiceConfig;
            _subscriptionsService = subscriptionsService;
            _customersService = customersService;
            _productsService = productsService;
            _notificationMailsService = notificationMailsService;
            _configuration = configuration;
            _appsettingsConfigurationService = appsettingsConfigurationService;
            _httpContextAccessor = httpContextAccessor;
        }


        public async Task SendMail(string receiver, string subject, string content, int countSubscriptions, string extraContent)
        {
            await Task.Run(() =>
            {
                SmtpClient client = new SmtpClient(_emailServiceConfig.SmtpServer);
                client.EnableSsl = true;  // Important ###
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(_emailServiceConfig.Username, _emailServiceConfig.Password);

                MailMessage mailMessage = new MailMessage();
                mailMessage.From = new MailAddress(_emailServiceConfig.From);
                mailMessage.To.Add(receiver);
                //mailMessage.Body = content;
                mailMessage.Subject = subject;

                //string html = @$"<html><body><img src=""cid:itl-logo"">{content}</body></html>";
                string html = @$"
                 <!DOCTYPE html PUBLIC """"-//W3C//DTD XHTML 1.0 Strict//EN"""" """"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"""">
                 <html xmlns=""""http://www.w3.org/1999/xhtml"""">
                   

                  <head>
                      <meta http-equiv=""""Content-Type"""" content=""""text/html; charset=utf-8"""">
                      <meta name=""""viewport"""" content=""""width=device-width"""">     
                  </head>
                  <body>
                    <div style=""width: 100%; display:flexbox; padding: 10px;""> 
                       
                      <!--Header-->
                       <div style=""width: 100%; display:flexbox; text-align: center;"">
                          <div style=""width:100%; border-bottom: 2px solid grey; margin-bottom: 5px;"">
                               <img style=""margin:5px auto 5px auto; max-width: 200px; width: auto; height:auto; object-fit: contain;"" src=""cid:itl-logo""/></div> 
                              </br>
                            <div style=""width:100%; border-bottom: 2px solid grey; margin-bottom: 5px;""><b><span style=""font-size: 30px; margin:5px auto 5px auto; text-align: center; "">
                             Abonementer klar til fakturering:</span></b> <span style=""font-size: 30px; margin:5px auto 5px auto; text-align: center;""><u>{countSubscriptions}</u></span></div>
                        </div>
                         
                      <!--Body-->
                       <div style=""display: flexbox; padding:10px;""> 
                          {content}
                       </div>
                      </br>
                        &nbsp;
                         {extraContent}
                      </br>
                      </div> 
                  </br>
                  </body>
                </html>
                 ";

                // HTML
                AlternateView altView = AlternateView.CreateAlternateViewFromString(html, null, MediaTypeNames.Text.Html);

                // LOGO IMG
                LinkedResource logoRes = new LinkedResource(Directory.GetCurrentDirectory() + @"\ClientApp\public\img\itl-crms-logo.png", MediaTypeNames.Image.Tiff);
                logoRes.ContentId = "itl-logo";
                altView.LinkedResources.Add(logoRes);
                mailMessage.AlternateViews.Add(altView);
                client.Send(mailMessage);
            });
        }





        public async Task<string> BuildNotificationMessage(List<SubscriptionsModel> subscriptions, List<CustomerModel> customers, List<ProductModel> products)
        {
            var countSubscriptions = subscriptions.Count;
            if (countSubscriptions > 0)
            {
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < countSubscriptions; i++)
                {

                    // Customer
                    CustomerModel customer = null;
                    string customerDomain = "";
                    var countCustomers = customers.Count;
                    for (int e = 0; e < countCustomers; e++)
                    {
                        if (customers[e].customerNumber == subscriptions[i].CustomerId) // If Customer found
                        {
                            customer = customers[e];
                            var domainsCount = customers[e].domains.Count;
                            for (int g = 0; g < domainsCount; g++) // Loop domains
                            {
                                if (customer.domains[g].Id == subscriptions[i].DomainId) // If Domain found
                                {
                                    customerDomain = customer.domains[g].DomainName;
                                }
                            }
                            break;
                        }
                    }

                    // Product
                    ProductModel product = null;
                    var countProducts = products.Count;
                    for (int r = 0; r < countProducts; r++)
                    {
                        if (products[r].productNumber == subscriptions[i].ProductId.ToString())
                        {
                            product = products[r];
                            break;
                        }
                    }


                    sb.Append($@"  <div style=""width:100%; border-bottom: 2px solid grey; margin-bottom: 5px; padding-bottom: 10px; padding-top: 10px"">
                        <p style=""font-size: 25px; font-weight: bold; margin:5px auto 5px auto; color: blue; text-decoration: underline;"">{customer.name}:</p>
                         <div style='font-size: 15px;'><b>Kunde Id:</b> <u>{subscriptions[i].CustomerId}</u></div>
                         <div style='font-size: 15px;'><b>Abonement Id:</b> <u>{subscriptions[i].Id}</u></div>
                         <div style='font-size: 15px;'><b>Domæne Id:</b> <u>{subscriptions[i].DomainId}</u></div>
                         <div style='font-size: 15px;'><b>Produkt Id:</b> <u>{subscriptions[i].ProductId}</u></div>
                     <br/>
                         <div style='font-size: 15px;'><b>Kunde Navn:</b> <u>{customer.name}</u></div>
                         <div style='font-size: 15px;'><b>Produkt Navn:</b> <u>{product.name}</u></div>
                         <div style='font-size: 15px;'><b>Domæne:</b> <a href='http://{customerDomain}'>{customerDomain}</a></div>   
                         <div style='font-size: 15px;'><b>Antal:</b> <u>{subscriptions[i].Quantity}</u></div>
                    <br/>
                         <div style='font-size: 15px;'><b>Sidst Faktureret:</b> <u>{subscriptions[i].LastInvoiced:dd/MM/yyyy}</u></div>
                         <div style='font-size: 15px;'><b>Start Periode:</b> <u>{subscriptions[i].PeriodStartDate:dd/MM/yyyy}</u></div>
                         <div style='font-size: 15px;'><b>Slut Periode:</b> <u>{subscriptions[i].PeriodEndDate:dd/MM/yyyy}</u></div>
                         <div style='font-size: 15px;'><b>Periode Type:</b> <u>{subscriptions[i].BillingPeriodType}</u></div>
                     </div>");
                }
                return await Task.FromResult(sb.ToString());
            }
            return "";
        }







        public async Task<int> SendToAllMails()
        {
            var subscriptions = await _subscriptionsService.GetSubscriptionsReadyForInvoicementAsync();
            var customers = await _customersService.GetAllCustomersWithDomains();
            var products = await _productsService.GetAllProducts();
            var mails = await _notificationMailsService.GetAllNotificationMails();

            var countMails = mails.Count;
            int countSubscriptions = subscriptions.Count;
            if (countMails > 0 && countSubscriptions > 0)
            {
                string msg = await BuildNotificationMessage(subscriptions, customers, products);
                // GET Configuration Service - tha I will make
                // Write To appsettings.js - the token - Guid.NewGuid().ToString("N");
                // Get Directory Pathc and make - url to send to SendMail

                string token = await _appsettingsConfigurationService.GenerateInvoiceTokenAsync(); // Generate Token
                await _appsettingsConfigurationService.SetInvoiceTokenAsync(token); // Save in Appsetings the token
                                                                                    //var baseUrl = AppDomain.CurrentDomain.GetData("BaseUrl").ToString();

                //var baseUrl = _httpContextAccessor.HttpContext.Request.Host.Value; // Get Base Url of the server
                var baseUrl = _configuration["BaseUrl"];
                var invoicementLink = $"https://{baseUrl}/api/Invoices/SendAllInvoicesByToken?token={token}"; // Url - Link to send all invoices
                var sendAllInvoicesButtonHtml = $"<a style='margin:30px; padding:10px; color:white; border: 1px solid rgb(142, 194, 255); border-radius: 5px;" +
                    $" background-color: rgb(0, 119, 255); text-decoration: none; font-weight: bold;' href='{invoicementLink}' target=''_blank'>Send Alle</a> ";
                for (int i = 0; i < countMails; i++)
                {
                    await SendMail(mails[i].Email, "ITL-CRMS", msg, countSubscriptions, sendAllInvoicesButtonHtml);
                }
                return 1;
            }
            return 0;
        }









        public async Task<int> SendResponseMailInvoicesSend()
        {
            var mails = await _notificationMailsService.GetAllNotificationMails();

            var countMails = mails.Count;
            if (countMails > 0)
            {
                string msg = "<b>Alle Fakturaer er sendt!</b>";
                for (int i = 0; i < countMails; i++)
                {
                    await SendMail(mails[i].Email, "ITL-CRMS", msg, 0, "");
                }
                return 1;
            }
            return 0;
        }








        public async Task SendRawMail(string receiver, string subject, string content)
        {
            await Task.Run(() =>
            {
                SmtpClient client = new SmtpClient(_emailServiceConfig.SmtpServer);
                client.EnableSsl = true;  // Important ###
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(_emailServiceConfig.Username, _emailServiceConfig.Password);

                MailMessage mailMessage = new MailMessage();
                mailMessage.From = new MailAddress(_emailServiceConfig.From);
                mailMessage.To.Add(receiver);
                //mailMessage.Body = content;
                mailMessage.Subject = subject;

                string html = @$"<html><body><img src=""cid:itl-logo"">{content}</body></html>";

                // HTML
                AlternateView altView = AlternateView.CreateAlternateViewFromString(html, null, MediaTypeNames.Text.Html);

                // LOGO IMG
                LinkedResource logoRes = new LinkedResource(Directory.GetCurrentDirectory() + @"\ClientApp\public\img\itl-crms-logo.png", MediaTypeNames.Image.Tiff);
                logoRes.ContentId = "itl-logo";
                altView.LinkedResources.Add(logoRes);
                mailMessage.AlternateViews.Add(altView);
                client.Send(mailMessage);
            });
        }

    }
}
