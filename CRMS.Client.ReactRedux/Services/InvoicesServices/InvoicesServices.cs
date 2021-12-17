using CRMS.Client.ReactRedux.DB;
using CRMS.Client.ReactRedux.Frame;
using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Models.Common;
using CRMS.Client.ReactRedux.Models.Dtos;
using CRMS.Client.ReactRedux.Models.IdentityModels;
using CRMS.Client.ReactRedux.Overloads;
using CRMS.Client.ReactRedux.Services.CustomersServices;
using CRMS.Client.ReactRedux.Services.ProductsServices;
using CRMS.Client.ReactRedux.Services.SubscriptionsServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.InvoicesServices
{
    // == || CLASS || ============================================================================================================================== 
    public class InvoicesServices : IInvoicesServices
    {
        private readonly IItlCrmsDbContext _itlCrmsDbContext;
        private readonly ISubscriptionsService _subscriptionsService;
        private readonly ICustomersService _customersService;
        private readonly IProductsService _productsService;



        // Constructor ---------------------------------------------------------------------------------------------------------------------------------------
        public InvoicesServices(IItlCrmsDbContext itlCrmsDbContext, ISubscriptionsService subscriptionsService,
            ICustomersService customersService, IProductsService productsService)
        {
            _itlCrmsDbContext = itlCrmsDbContext;
            _subscriptionsService = subscriptionsService;
            _customersService = customersService;
            _productsService = productsService;
        }







        // Get ALL - Invoices Drafts----------------------------------------------------------------------------------------------------------------------------------
        public async Task<InvoiceesListModel> GetAllInvoiceDraftsAsync()
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.GetAsync(EconomicsHttpClientHandler.eConomicsApiAddress + "/invoices/drafts?pagesize=1000"))
                {
                    string content = await response.Content.ReadAsStringAsync(); // Result
                    var invoices = System.Text.Json.JsonSerializer.Deserialize<InvoiceesListModel>(content); // Get prop from apiResponse
                    return invoices;
                }
            }
        }








        // Get ALL - Invoices Drafts With Products----------------------------------------------------------------------------------------------------------------------------------
        public async Task<List<InvoiceModel>> GetAllFullInvoiceDraftsAsync()
        {
            var raw_drafts = await GetAllInvoiceDraftsAsync();
            var fullDraftsList = new List<InvoiceModel>();
            var draftCount = raw_drafts.collection.Count;

            if (raw_drafts.collection.Count > 0)
            {
                for (int i = 0; i < draftCount; i++)
                {
                    var invoiceDraft = await GetInvoiceDraftByIdAsync(raw_drafts.collection[i].draftInvoiceNumber);
                    invoiceDraft.draftLog = await GetDraftInvoiceLogByInvoiceIdAsync(invoiceDraft.draftInvoiceNumber);
                    fullDraftsList.Add(invoiceDraft);
                }
            }
            return fullDraftsList;
        }









        // Get - Invoice Draft By ID ------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<InvoiceModel> GetInvoiceDraftByIdAsync(int draftId)
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.GetAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/invoices/drafts/{draftId}"))
                {
                    string content = await response.Content.ReadAsStringAsync(); // Result
                    if (response.IsSuccessStatusCode)
                    {
                        var invoiceDraft = System.Text.Json.JsonSerializer.Deserialize<InvoiceModel>(content); // Get prop from apiResponse
                        return invoiceDraft;
                    }
                    return null;
                }
            }
        }








        // DELTE - DELTE FAILED - DRAFT - from economics ---------------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> DeleteInvoiceDraftAsync(int draftId)
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.DeleteAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/invoices/drafts/{draftId}"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        return 1;
                    }
                    return 0;
                }
            }
        }










        // Invoice - CreateDrafts ----------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> CreateInvoiceDraftsFromJsonAsync(JsonElement jsonDrafts, string userEmail)
        {
            List<object> draftInvoices = JsonConvert.DeserializeObject<List<object>>(jsonDrafts.ToString()); // Drafts
            List<string> errors = new List<string>(); // Errors

            using (var httpClient = new EconomicsHttpClientHandler())
            {
                for (int i = 0; i < draftInvoices.Count; i++)  // Loop all invoiceDrafts and send to economics
                {
                    var response = await httpClient.PostAsync(EconomicsHttpClientHandler.eConomicsApiAddress + "/invoices/drafts", new StringContent(draftInvoices[i].ToString(), Encoding.UTF8, "application/json"));   // Post

                    // If Error
                    if (response.IsSuccessStatusCode)
                    {
                        var linesJsonArr = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(draftInvoices[i].ToString()).GetProperty("lines"); // Get Lines from 
                        var linesList = JsonConvert.DeserializeObject<List<object>>(linesJsonArr.ToString());

                        // Draft ID - Draft to remove from economics
                        System.Text.Json.JsonSerializer.Deserialize<JsonElement>(await response.Content.ReadAsStringAsync()).GetProperty("draftInvoiceNumber").TryGetInt32(out int invoiceDraftId);

                        // Loop Lines
                        foreach (var jsonLine in linesList)
                        {
                            var line = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(jsonLine.ToString()); // Get line from JsonLine
                            var product = line.GetProperty("product"); // Get Product
                            product.GetProperty("subscriptionId").TryGetInt32(out int subscriptionsId); // Get SubscriptionId

                            //  Renew - subscription 
                            var renewetSubscription = await _subscriptionsService.RenewSubscriptionAsync(subscriptionsId);

                            //  Update - subscription
                            int success = await _subscriptionsService.UpdateRenewetSubscriptionAsync(renewetSubscription);

                            if (success != 1)
                            {

                                if (await DeleteInvoiceDraftAsync(invoiceDraftId) == 1)
                                {
                                    errors.Add($"DraftError: Draft bound to Subscription with ID:{subscriptionsId} was sent but than deleted from economics due to Local DB error 'Could not save to DB'");  // Add errors to error list
                                }
                                else
                                {
                                    errors.Add($"DraftCriticalError: Draft bound to Subscription with ID:{subscriptionsId} was sent to economics but not saved to the local DB - and could not be deleted from economics"); // Add errors to error list
                                }
                            }
                        }
                        if (errors.Count == 0)
                        {
                            // Invoice Log
                            var draftLog = new InvoiceDraftLog();
                            draftLog.InvoiceDraftId = invoiceDraftId;
                            draftLog.UserEmail = userEmail;
                            draftLog.InvoiceDateTime = DateTime.Now;
                            await CreateDraftInvoiceLogAsync(draftLog);
                        }
                    }
                    else
                    {
                        errors.Add(response.ToString()); // Add to list - error
                    }
                    response.Dispose();
                }

            }

            // Returns           
            if (errors.Count == 0)
            {
                return 1;
            }
            else
            {
                return 0;
            }
        }


















        // Invoice - CreateDrafts ----------------------------------------------------------------------------------------------------------------------------------
        public async Task<List<InvoicePostDto>> CreateInvoiceDraftsFromSubscriptionsAsync(List<SubscriptionsModel> subscriptions)
        {
            var readyInvoices = new List<InvoicePostDto>(); // ReadyInvoices
            var groupedSubscriptions = await _subscriptionsService.GroupSubscriptionsByCustomerAsync(subscriptions);


            // Build Invoices - multi lines  *****************************************************************************************************
            foreach (KeyValuePair<int, List<SubscriptionsModel>> entry in groupedSubscriptions)  // KEY = customerID VALUE = List CustomerSubscriptions
            {
                var customer = await _customersService.GetCustomerById(entry.Key);
                var today = DateTime.Now.ToString("yyyy-MM-dd");
                var newInvoiceDraft = new InvoicePostDto();
                newInvoiceDraft.date = today;
                newInvoiceDraft.currency = "DKK";

                var paymentTerms = new PaymentTerms();
                paymentTerms.paymentTermsNumber = 1;
                paymentTerms.daysOfCredit = 14;
                paymentTerms.name = "Lobende maned 14 dage";
                paymentTerms.paymentTermsType = "net";
                newInvoiceDraft.paymentTerms = paymentTerms;
                newInvoiceDraft.dueDate = DateTime.Now.AddDays(14).ToString("yyyy-MM-dd");

                var references = new References();
                references.other = "";
                newInvoiceDraft.references = references;


                var customerD = new Customer();
                customerD.customerNumber = customer.customerNumber;
                newInvoiceDraft.customer = customerD;


                var layout = new Layout();
                layout.layoutNumber = 19;
                newInvoiceDraft.layout = layout;



                var vatZone = new VatZone();
                vatZone.name = "Domestic";
                vatZone.vatZoneNumber = 1;
                vatZone.enabledForCustomer = true;
                vatZone.enabledForSupplier = true;
                newInvoiceDraft.vatZone = vatZone;
                newInvoiceDraft.vatAmount = 25;


                var recipient = new RecipientPostDto();
                recipient.name = customer.name;
                recipient.address = customer.address;
                recipient.zip = customer.zip;
                recipient.city = customer.city;
                recipient.vatZone = vatZone; // THe same Vatzone as VatZone ^
                //recipient.cvr = customer.corporateIdentificationNumber;
                newInvoiceDraft.recipient = recipient;


                var delivery = new Delivery();
                delivery.address = customer.address;
                delivery.zip = customer.zip;
                delivery.city = customer.city;
                delivery.country = "Denmark";
                delivery.deliveryDate = today;
                newInvoiceDraft.delivery = delivery;

                // Make for loop
                // Create New Line foreach sub in dict.set.value
                // Add the line to lines
                for (int i = 0; i < entry.Value.Count; i++)
                {
                    var product = await _productsService.GetProductById(entry.Value[i].ProductId.ToString());
                    var newLine = new Line();
                    newLine.lineNumber = i + 1;
                    newLine.sortKey = 1;
                    newLine.description = product.name;

                    var unit = new Unit();
                    unit.name = product.unit.name;
                    unit.unitNumber = product.unit.unitNumber;
                    newLine.unit = unit;

                    var productD = new InvoiceProduct();
                    productD.productNumber = product.productNumber;
                    productD.subscriptionId = entry.Value[i].Id;
                    newLine.product = productD;

                    newLine.quantity = (float)entry.Value[i].Quantity;
                    newLine.unitNetPrice = product.salesPrice;
                    newLine.discountPercentage = 0.00;
                    newLine.totalNetAmount = product.salesPrice;
                    newInvoiceDraft.lines.Add(newLine);
                }
                readyInvoices.Add(newInvoiceDraft);
            }
            return readyInvoices;
        }









        // Send All Invoices ----------------------------------------------------------------------------------------------------------------------------------
        public async Task<List<string>> SendAllInvoicesAsync(string userEmail)
        {
            var getSubscriptionsForInvoicement = await _subscriptionsService.GetSubscriptionsReadyForInvoicementAsync();
            List<string> errors = new List<string>(); // Errors

            if (getSubscriptionsForInvoicement.Count > 0)
            {
                var draftInvoices = await CreateInvoiceDraftsFromSubscriptionsAsync(getSubscriptionsForInvoicement);

                // ====================================================================================
                using (var httpClient = new EconomicsHttpClientHandler())
                {
                    for (int i = 0; i < draftInvoices.Count; i++)  // Loop all invoiceDrafts and send to economics
                    {
                        var response = await httpClient.PostAsync(EconomicsHttpClientHandler.eConomicsApiAddress + "/invoices/drafts", new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(draftInvoices[i]), Encoding.UTF8, "application/json"));   // Post

                        // If Error
                        if (response.IsSuccessStatusCode)
                        {
                            var linesList = draftInvoices[i].lines;
                            // Draft ID - Draft to remove from economics
                            System.Text.Json.JsonSerializer.Deserialize<JsonElement>(await response.Content.ReadAsStringAsync()).GetProperty("draftInvoiceNumber").TryGetInt32(out int invoiceDraftId);

                            // Loop Lines
                            foreach (var line in linesList)
                            {
                                var subscriptionId = line.product.subscriptionId; // Get Product

                                //  Renew - subscription 
                                var renewetSubscription = await _subscriptionsService.RenewSubscriptionAsync(subscriptionId);

                                //  Update - subscription
                                int success = await _subscriptionsService.UpdateRenewetSubscriptionAsync(renewetSubscription);


                                if (success != 1)
                                {
                                    if (await DeleteInvoiceDraftAsync(invoiceDraftId) == 1)
                                    {
                                        errors.Add($"DraftError: Draft bound to Subscription with ID:{subscriptionId} was sent but than deleted from economics due to Local DB error 'Could not save to DB'");  // Add errors to error list
                                    }
                                    else
                                    {
                                        errors.Add($"DraftCriticalError: Draft bound to Subscription with ID:{subscriptionId} was sent to economics but not saved to the local DB - and could not be deleted from economics"); // Add errors to error list
                                    }
                                }
                            }

                            if (errors.Count == 0)
                            {
                                // Invoice Log
                                var draftLog = new InvoiceDraftLog();
                                draftLog.InvoiceDraftId = invoiceDraftId;
                                draftLog.UserEmail = userEmail;
                                draftLog.InvoiceDateTime = DateTime.Now;
                                await CreateDraftInvoiceLogAsync(draftLog);
                            }
                        }
                        else
                        {
                            errors.Add(response.ToString()); // Add to list - error
                        }
                        response.Dispose();
                    }

                }
                return errors;
            }
            errors.Add("Der er ingen Abonnementer der skal faktureres!");
            return errors;
        }






        // Invoice Draft Log #############################################################################################################################################
        // Create Ivoice Draft Log ----------------------------------------------------------------------------------------------------------------------------
        public async Task<int> CreateDraftInvoiceLogAsync(InvoiceDraftLog draftLog)
        {
            await _itlCrmsDbContext.Set<InvoiceDraftLog>().AddAsync(draftLog);

            // If Saved
            if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
            {
                return 1;
            }
            return 0;
        }





        // Get Invoice Draft Log By draft Id ----------------------------------------------------------------------------------------------------------------------------- 
        public async Task<InvoiceDraftLog> GetDraftInvoiceLogByInvoiceIdAsync(int invoiceDraftId)
        {
            return await _itlCrmsDbContext.Set<InvoiceDraftLog>().FirstOrDefaultAsync(i => i.InvoiceDraftId == invoiceDraftId);
        }





        // Get All - Draft Logs ---------------------------------------------------------------------------------------------------------------------------- 
        public async Task<List<InvoiceDraftLog>> GetAllDraftInvoiceLogsAsync()
        {
            return await _itlCrmsDbContext.Set<InvoiceDraftLog>().ToListAsync();
        }

    }
}






















            //// Add-Invoice-Copy-To-Db ---------------------------------------------------------------------------------------------------------------------------------------
        //public async Task<bool> AddInvoiceCopyToDb(SentInvoicesModel sentInvoice)
        //{
        //    _context.Set<SentInvoicesModel>().Add(sentInvoice);

        //    // If Saved
        //    if (await _context.SaveChangesAsync() > 0)
        //    {
        //        return true;
        //    }
        //    return false;
        //}



//// Renew - Subscription ---------------------------------------------------------------------------------------------------------------------------------------
//public async Task<SubscriptionsModel> RenewSubscription(int subscriptionID)
//{
//    // Get
//    var subscription_exists = await _itlCrmsDbContext.Set<SubscriptionsModel>().FirstOrDefaultAsync(s => s.Id == subscriptionID);

//    // If Exists in the DB  
//    if (subscription_exists != null)
//    {

//        // Today - Date
//        string todayString = DateTime.Now.ToString("yyyy-MM-dd");
//        DateTime today = DateTime.ParseExact(todayString, "yyyy-MM-dd", CultureInfo.InvariantCulture);


//        // Map
//        SubscriptionsModel subscriptionRenew = new SubscriptionsModel();
//        subscriptionRenew.Id = subscription_exists.Id;
//        subscriptionRenew.Quantity = subscription_exists.Quantity;
//        subscriptionRenew.DomainId = subscription_exists.DomainId;
//        subscriptionRenew.BillingPeriodType = subscription_exists.BillingPeriodType;
//        subscriptionRenew.CreationDate = subscription_exists.CreationDate;
//        subscriptionRenew.PeriodStartDate = today;
//        subscriptionRenew.LastInvoiced = today;
//        subscriptionRenew.ProductId = subscription_exists.ProductId;
//        subscriptionRenew.CustomerId = subscription_exists.CustomerId;
//        subscriptionRenew.Description = subscription_exists.Description;


//        //  Billing Period - Yearly, Semiannual, Quarterly, Monthly
//        // Yearly
//        if (subscription_exists.BillingPeriodType == BillingPeriodType.Yearly)
//        {
//            // End - Date
//            string endDateString = DateTime.Today.AddYears(+1).ToString("yyyy-MM-dd");
//            DateTime endDateYear = DateTime.ParseExact(endDateString, "yyyy-MM-dd", CultureInfo.InvariantCulture);

//            subscriptionRenew.PeriodEndDate = endDateYear;
//        }
//        // Semiannual
//        else if (subscription_exists.BillingPeriodType == BillingPeriodType.Semiannual)
//        {
//            // End - Date
//            string endDateString = DateTime.Today.AddMonths(+6).ToString("yyyy-MM-dd");
//            DateTime endDateSemiannual = DateTime.ParseExact(endDateString, "yyyy-MM-dd", CultureInfo.InvariantCulture);

//            subscriptionRenew.PeriodEndDate = endDateSemiannual;
//        }
//        // Quarterly
//        else if (subscription_exists.BillingPeriodType == BillingPeriodType.Quarterly)
//        {
//            // End - Date
//            string endDateString = DateTime.Today.AddMonths(+3).ToString("yyyy-MM-dd");
//            DateTime endDateQuarterly = DateTime.ParseExact(endDateString, "yyyy-MM-dd", CultureInfo.InvariantCulture);

//            subscriptionRenew.PeriodEndDate = endDateQuarterly;
//        }
//        // Monthly
//        else
//        {
//            // End - Date
//            string endDateString = DateTime.Today.AddMonths(+1).ToString("yyyy-MM-dd");
//            DateTime endDateMonthly = DateTime.ParseExact(endDateString, "yyyy-MM-dd", CultureInfo.InvariantCulture);

//            subscriptionRenew.PeriodEndDate = endDateMonthly;
//        }
//        return subscriptionRenew;
//    }

//    return null;
//}








//// Update - RenewetSubscription ---------------------------------------------------------------------------------------------------------------------------------------
//public async Task<bool> UpdateRenewetSubscription(SubscriptionsModel subscriptionToUpdate)
//{
//    var subscription_exists = await _itlCrmsDbContext.Set<SubscriptionsModel>().FirstOrDefaultAsync(s => s.Id == subscriptionToUpdate.Id);

//    // If Exists in the DB Update it
//    if (subscription_exists != null)
//    {
//        _itlCrmsDbContext.Entry(subscription_exists).CurrentValues.SetValues(subscriptionToUpdate);  // Update / Replace Values

//        // Save OK
//        if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
//        {
//            return true;
//        }
//    }
//    return false;
//}



