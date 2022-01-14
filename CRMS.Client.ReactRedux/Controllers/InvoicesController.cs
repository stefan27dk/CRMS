using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Overloads;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
 
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using CRMS.Client.ReactRedux.Services.InvoicesServices;
using CRMS.Client.ReactRedux.DB;
using CRMS.Client.ReactRedux.Services.SubscriptionsServices;
using CRMS.Client.ReactRedux.Services.ConfigurationServices;
using CRMS.Client.ReactRedux.Services.EmailServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using CRMS.Client.ReactRedux.Models.IdentityModels;
using Microsoft.AspNetCore.Identity;

namespace CRMS.Client.ReactRedux.Controllers
{
    // == || CLASS - Invoices || ============================================================================================================================== 
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly IInvoicesServices _invoicesServices;
        private readonly ISubscriptionsService _subscriptionsService;
        private readonly IAppsettingsConfigurationService _appsettingsConfigurationService;
        private readonly IEmailService _emailService;
        private readonly UserManager<ApplicationUser> _userManager; 

        // Constructor ---------------------------------------------------------------------------------------------------------------------------------------
        public InvoicesController(IInvoicesServices invoicesServices, ISubscriptionsService subscriptionsService,
            IAppsettingsConfigurationService appsettingsConfigurationService,
            IEmailService emailService, UserManager<ApplicationUser> userManager)
        {
            _invoicesServices = invoicesServices;
            _subscriptionsService = subscriptionsService;
            _appsettingsConfigurationService = appsettingsConfigurationService;
            _emailService = emailService;
            _userManager = userManager;
        }




        // Invoice - CreateDrafts ----------------------------------------------------------------------------------------------------------------------------------
        [Authorize(Roles = "user, admin")]
        [HttpPost]
        [Route("CreateInvoiceDraftsFromJson")]
        public async Task<IActionResult> CreateInvoiceDraftsFromJsonAsync([FromBody] JsonElement jsonDrafts)
        {
            var currentUser = await _userManager.GetUserAsync(HttpContext.User);
            var created_and_send =  await _invoicesServices.CreateInvoiceDraftsFromJsonAsync(jsonDrafts, currentUser.Email);

            if(created_and_send == 1)
            {
                return await GetAllFullInvoiceDraftsAsync();
            }
            return StatusCode(500, "Server Fejl - Nogen aller alle - Fakturaer blev ikke sendt!");
        }






        // Delete- Invoices Draft ----------------------------------------------------------------------------------------------------------------------------------
        [Authorize(Roles = "user, admin")]
        [HttpDelete]
        [Route("DeleteInvoiceDraft")]
        public async Task<IActionResult> DeleteInvoiceDraftAsync(int draftId)
        {
            if(draftId != 0)
            {    
                var draft_deleted = await _invoicesServices.DeleteInvoiceDraftAsync(draftId);
                if (draft_deleted == 1)
                {
                    return StatusCode(200, await GetAllFullInvoiceDraftsAsync());
                }
                return StatusCode(500, "Faktura med ID: {draftId} blev ikke slettet!");
            }
            return StatusCode(400, "Invalid Input!");
        }








        // Get ALL - Invoices Drafts----------------------------------------------------------------------------------------------------------------------------------
        [HttpGet]
        [Route("GetAllInvoiceDrafts")]
        public async Task<IActionResult> GetAllInvoiceDraftsAsync()
        {
            return StatusCode(200, await _invoicesServices.GetAllInvoiceDraftsAsync());
        }






        // Get ALL FULL - Invoices Drafts----------------------------------------------------------------------------------------------------------------------------------
        [HttpGet]
        [Route("GetAllFullInvoiceDrafts")]
        public async Task<IActionResult> GetAllFullInvoiceDraftsAsync()
        {
            return StatusCode(200, await _invoicesServices.GetAllFullInvoiceDraftsAsync());
        }










        // Get - Invoice ------------------------------------------------------------------------------------------------------------------------------------------
        [HttpGet]
        [Route("GetInvoiceDraftById")]
        public async Task<IActionResult> GetInvoiceDraftByIdAsync(int draftId)
        {
            return StatusCode(200, await _invoicesServices.GetInvoiceDraftByIdAsync(draftId));
        }






        // Send - Invoices By - Token ------------------------------------------------------------------------------------------------------------------------------------------
        //[AllowAnonymous]
        //[EnableCors("AllowAll")]
        //[Route("SendAllInvoicesByToken/{token}")]
        //[HttpPost("SendAllInvoicesByToken/{token}")]
        //[Route("SendAllInvoicesByToken/{token}"), AllowAnonymous, HttpGet]
        [Route("SendAllInvoicesByToken"), AllowAnonymous, HttpGet]
        public async Task<IActionResult> SendAllInvoicesByToken(string token)
        {
            string localToken = await _appsettingsConfigurationService.GetInvoiceTokenAsync();
            if (localToken == token)
            {
                var errors = await _invoicesServices.SendAllInvoicesAsync("Sendt Fra Email"); 
                if(errors.Count == 0)
                {
                    await _emailService.SendResponseMailInvoicesSend();
                    return StatusCode(200, "\n Alle Fakturaer er Sendt! \n \n Du få email snart!");
                }
                return StatusCode(500, errors);
            }
            return StatusCode(400, $"Invalid Input! - {token}");
        }








        // Send All Invoices ------------------------------------------------------------------------------------------------------------------------------------------
        [Authorize(Roles = "user, admin")]
        [HttpPost]
        [Route("SendAllInvoices")]
        public async Task<IActionResult> SendAllInvoices()
        {
            var currentUser = await _userManager.GetUserAsync(HttpContext.User);
            var errors = await _invoicesServices.SendAllInvoicesAsync(currentUser.Email);
                if (errors.Count == 0)
                {
                    return StatusCode(200, await _invoicesServices.GetAllFullInvoiceDraftsAsync());
                }
                return StatusCode(500, errors);
        }




        // Get ALL - InvoiceLogs ----------------------------------------------------------------------------------------------------------------------------------
        [HttpGet]
        [Route("GetAllDraftInvoiceLogs")]
        public async Task<IActionResult> GetAllDraftInvoiceLogs()
        {
            return StatusCode(200, await _invoicesServices.GetAllDraftInvoiceLogsAsync());
        }




        // Get - InvoiceLog By invoice Id ----------------------------------------------------------------------------------------------------------------------------------
        [HttpGet]
        [Route("GetDraftInvoiceLogByDraftId")]
        public async Task<IActionResult> GetDraftInvoiceLogByDraftId(int invoiceDraftid)
        {
            return StatusCode(200, await _invoicesServices.GetInvoiceDraftByIdAsync(invoiceDraftid));
        }


        // Get Generated Invoice Drafts ------------------------------------------------------------------------------------------------------------------------------------------
        [HttpGet]
        [Route("GetGeneratedDraftInvoices")]
        public async Task<IActionResult> GetGeneratedDraftInvoices()
        {
            var readySubscriptions = await _subscriptionsService.GetSubscriptionsReadyForInvoicementAsync();
          
            if(readySubscriptions.Count > 0)
            {
               var draftInvoices = await _invoicesServices.CreateInvoiceDraftsFromSubscriptionsAsync(readySubscriptions);
                return StatusCode(200, draftInvoices[0]);
            }
            return StatusCode(422, "Der er ikke klar abonnmenter til fakturering!");
        }
    }

}












//// Get ALL - Invoices ----------------------------------------------------------------------------------------------------------------------------------
//[HttpGet]
//[Route("GetAll")]
//public async Task<IEnumerable> GetAll()
//{
//    using (var httpClient = new EconomicsHttpClientHandler())
//    {
//        using (var response = await httpClient.GetAsync(EconomicsHttpClientHandler.eConomicsApiAddress + "/invoices"))
//        {
//            string apiResponse = await response.Content.ReadAsStringAsync(); // Result

//            var jsonResult = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(apiResponse).GetProperty("collection"); // Get prop from apiResponse
//            return jsonResult.EnumerateArray();
//        }
//    }
//}













//// Invoice - CreateDrafts ----------------------------------------------------------------------------------------------------------------------------------
//[HttpPost]
//[Route("CreateDrafts")]
//public async Task<IActionResult> CreateDrafts([FromBody] JsonElement jsonDrafts)
//{
//    List<object> draftInvoices = JsonConvert.DeserializeObject<List<object>>(jsonDrafts.ToString()); // Drafts
//    List<string> errors = new List<string>(); // Errors
//    List<SubscriptionsModel> updatedSubscriptions = new List<SubscriptionsModel>(); // Updated Subscriptions

//    using (var httpClient = new EconomicsHttpClientHandler())
//    {
//        for (int i = 0; i < draftInvoices.Count; i++)  // Loop all invoiceDrafts and send to economics
//        {
//            var response = await httpClient.PostAsync(EconomicsHttpClientHandler.eConomicsApiAddress + "/invoices/drafts", new StringContent(draftInvoices[i].ToString(), Encoding.UTF8, "application/json"));   // Post

//            // If Error
//            if (response.IsSuccessStatusCode)
//            {
//                var linesJsonArr = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(draftInvoices[i].ToString()).GetProperty("lines"); // Get Lines from 
//                var linesList = JsonConvert.DeserializeObject<List<object>>(linesJsonArr.ToString());


//                // Loop Lines
//                foreach (var jsonLine in linesList)
//                {
//                    var line = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(jsonLine.ToString()); // Get line from JsonLine
//                    var product = line.GetProperty("product"); // Get Product
//                    product.GetProperty("subscriptionId").TryGetInt32(out int subscriptionsId); // Get SUbscriptionId

//                    //  Renew 
//                    var renewetSubscription = await _subscriptionsService.RenewSubscriptionAsync(subscriptionsId);

//                    //  Update
//                    int success = await _subscriptionsService.UpdateRenewetSubscriptionAsync(renewetSubscription);

//                    if (success != 1)
//                    {
//                        // Draft ID - Draft to remove from economics
//                        System.Text.Json.JsonSerializer.Deserialize<JsonElement>(await response.Content.ReadAsStringAsync()).GetProperty("draftInvoiceNumber").TryGetInt32(out int draftToRemoveId);
//                        if (await _invoicesServices.DeleteInvoiceDraftAsync(draftToRemoveId) == 1)
//                        {
//                            errors.Add($"DraftError: Draft bound to Subscription with ID:{subscriptionsId} was sent but than deleted from economics due to Local DB error 'Could not save to DB'");  // Add errors to error list
//                        }
//                        else
//                        {
//                            errors.Add($"DraftCriticalError: Draft bound to Subscription with ID:{subscriptionsId} was sent to economics but not saved to the local DB - and could not be deleted from economics"); // Add errors to error list
//                        }
//                    }
//                }
//            }
//            else
//            {
//                errors.Add(response.ToString()); // Add to list - error
//            }
//            response.Dispose();
//        }

//    }

//    // Returns           
//    if (errors.Count == 0)
//    {
//        return StatusCode(201, await _invoicesServices.GetAllSubscriptions());
//    }
//    else
//    {
//        return StatusCode(409, errors);
//    }
//}