using CRMS.Client.ReactRedux.DB;
using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Overloads;
using CRMS.Client.ReactRedux.Services.ConfigurationServices;
using CRMS.Client.ReactRedux.Services.CustomersServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Controllers
{
    // == || CLASS - Customer || ============================================================================================================================== 
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomersService _customersService;
        private readonly IAppsettingsConfigurationService _appsettingsConfigurationService;




        // Constructor ---------------------------------------------------------------------------------------------------------------------------------------
        public CustomersController(ICustomersService customersService, IAppsettingsConfigurationService appsettingsConfigurationService)
        {
            _customersService = customersService;
            _appsettingsConfigurationService = appsettingsConfigurationService;
        }



        // Get ALL - Customers With Domains ----------------------------------------------------------------------------------------------------------------------------------
        [HttpGet]
        [Route("GetAllCustomersWithDomains")]
        public async Task<IActionResult> GetAllCustomersWithDomains()
        {
            var customers = await _customersService.GetAllCustomersWithDomains();
            if(customers != null)
            {
                return StatusCode(200, customers);
            }
            return StatusCode(500, "Server Fejl!");
        }





        // Get ALL - Customers ----------------------------------------------------------------------------------------------------------------------------------
        [HttpGet]   
        [Route("GetAllCustomers")]
        public async Task<IActionResult> GetAllCustomers()
        {
            var customers = await _customersService.GetAllCustomers();
            if (customers != null)
            {
                return StatusCode(200, customers);
            }
            return StatusCode(500, "Server Fejl!");
        }


         


        // Get - Customer ------------------------------------------------------------------------------------------------------------------------------------------
        [HttpGet]
        [Route("GetCustomerById")]
        public async Task<IActionResult> GetCustomerById(int customerId)
        {
            if(customerId > 0)
            {
              var customer = await _customersService.GetCustomerById(customerId);
                if(customer != null)
                {
                    return StatusCode(200, customer);
                }
                return StatusCode(404, $"Kunde med ID: {customerId} eksiter ikke!");
            }
            return StatusCode(400, "Fejl i input!");
        }



        // Add - Customer ------------------------------------------------------------------------------------------------------------------------------------------
        [HttpPost]
        [Route("AddCustomer")]
        public async Task<IActionResult> AddCustomer(JsonElement customer)
        {
                int customer_added = await _customersService.AddCustomer(customer);
                if (customer_added == 1)
                {
                   return await GetAllCustomersWithDomains();
                }
                  return StatusCode(500, $"Server fejl! - Kunde kunne ikke oprettes!");
        }


            



        // Update - Customer ------------------------------------------------------------------------------------------------------------------------------------------
        [HttpPut]
        [Route("UpdateCustomer")]
        public async Task<IActionResult> UpdateCustomer(JsonElement customer, int customerId)
        {
             
                int customer_added = await _customersService.UpdateCustomer(customer, customerId);
                if (customer_added == 1)
                {
                    return StatusCode(201, new { Customer = await _customersService.GetCustomerById(customerId), Customers = await _customersService.GetAllCustomersWithDomains()});
                }
                else if (customer_added == 0)
                {
                    return StatusCode(500, $"Server fejl! - Kunde med Id: customerId blev ikke opdateret!");
                }    

            return StatusCode(400, "Fejl i input!");
        }




        //###################################################################################################################################################################
        // CONTACT PERSONS =======================================================================================================================================================
        // Get - Customer Contact Persons------------------------------------------------------------------------------------------------------------------------------------------
        [HttpGet("GetCustomerContactPersons")]
        public async Task<IActionResult> GetCustomerContactPersons(int customerId)
        {
            if (customerId != 0)
            {
                var contactPersons = await _customersService.GetContactPersons(customerId);
                if(contactPersons != null)
                {  
                  return StatusCode(200, contactPersons);
                }
                return StatusCode(500, $"Server fejl! - Kunne ikke hente kontaktpersoner for Kunde med ID: {customerId}");
            }
            return StatusCode(400, "Fejl i input!");
        }








        // Delete - Customer Contact Person ------------------------------------------------------------------------------------------------------------------------------------------
        [HttpDelete("DeleteContactPerson")]
        public async Task<IActionResult> DeleteContactPerson(int customerId, int contactId)  
        {
            if (customerId != 0 && contactId != 0)
            {
                var contactPerson_deleted = await _customersService.DeleteContactPerson(customerId, contactId);
                if(contactPerson_deleted == 1)
                {
                    return await GetCustomerContactPersons(customerId);
                }
                return StatusCode(500, $"Server Fejl! - Kunne ikke slettet Kontakperson med ID: {contactId} fra kunde med ID: {customerId}");
            }
            return StatusCode(400, "Fejl i input!");
        }







        // Update - Customer Contact Person ------------------------------------------------------------------------------------------------------------------------------------------
        [HttpPut("UpdateContactPerson")]
        public async Task<IActionResult> UpdateContactPerson([FromBody] JsonElement jsonContact, int customerId, int contactId)
        {
            if (customerId != 0 && contactId!= 0)
            {
                int contact_updated = await _customersService.UpdateContactPerson(jsonContact, customerId, contactId);
                if (contact_updated == 1)
                {
                    return await GetCustomerContactPersons(customerId);
                }
                else if (contact_updated == 0)
                {
                    return StatusCode(500, $"Server fejl! - Kontaktperson med ID: {contactId} blev ikke opdateret!");
                }
            }
            return StatusCode(400, "Fejl i input!");
        }









        // Create - Customer Contact Person ------------------------------------------------------------------------------------------------------------------------------------------
        [HttpPost("CreateContactPerson")]
        public async Task<IActionResult> CreateContactPerson([FromBody] JsonElement jsonContact, int customerId)
        {     
                int contact_added = await _customersService.CreateContactPerson(jsonContact, customerId);
                if (contact_added == 1)
                {
                    return await GetCustomerContactPersons(customerId);
                }
                    return StatusCode(500, $"Server fejl! - Kontakperson kunne ikke oprettes!");
        }










        // Delete - Customer ------------------------------------------------------------------------------------------------------------------------------------------
        [HttpDelete("DeleteCustomer")]
        public async Task<IActionResult> DeleteCustomer(int customerId)
        {
            var product_deleted = await _customersService.DeleteCustomerAsync(customerId);
            if (product_deleted == 1)
            {
                return await GetAllCustomersWithDomains();
            }
            return StatusCode(500, $"Server Fejl! - Kunne ikke slette Kunde med ID: {customerId}");
        }








        // CVR API Adress #####################################################################################################################
        [HttpGet]
        [Route("GetCvrApiAddress")]
        public async Task<JsonElement> GetCvrApiAddress()
        {
            return await _appsettingsConfigurationService.GetCvrApiAddressAsync();
        }




        // ===== Set CVR API Address =====================================================================
        [HttpPut]
        [Route("SetCvrApiAddress")]
        public async Task<IActionResult> SetCvrApiAddress(string cvrApiAddress)
        {
            if (!string.IsNullOrWhiteSpace(cvrApiAddress))
            {
                await _appsettingsConfigurationService.SetCvrApiAddressAsync(cvrApiAddress);
                return StatusCode(200, await GetCvrApiAddress());
            }
            return StatusCode(400, "Invalid Input!");
        }




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
        //                    var renewetSubscription = await _invoicesServices.RenewSubscription(subscriptionsId);
        //                    //  Update
        //                    bool success = await _invoicesServices.UpdateRenewetSubscription(renewetSubscription);

        //                    if (success != true)
        //                    {
        //                        // Draft ID - Draft to remove from economics
        //                        System.Text.Json.JsonSerializer.Deserialize<JsonElement>(await response.Content.ReadAsStringAsync()).GetProperty("draftInvoiceNumber").TryGetInt32(out int draftToRemoveId);
        //                        if (await _invoicesServices.DeleteDraft(draftToRemoveId))
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












        //###################################################################################################################################################################
        // DOMAINS =======================================================================================================================================================
        // Get - Customer Domains------------------------------------------------------------------------------------------------------------------------------------------
        //[HttpGet("{customerId}/Domains")]
        //public async Task<IEnumerable> GetCustomerDomains(int customerId)
        //{
        //    return await PrivateGetAllCustomerDomains(customerId);
        //}





        //// Get - Domain by Name------------------------------------------------------------------------------------------------------------------------------------------
        //[HttpGet]
        //[Route("GetDomainByName")]
        //public async Task<IEnumerable> GetDomainByName(string domainName)
        //{
        //    return await _context.CustomersDomains.Where(d => d.DomainName == domainName).ToListAsync();
        //}





        //// Delete - Customer Domain by Name ------------------------------------------------------------------------------------------------------------------------------------------
        //[HttpDelete]
        //[Route("DeleteDomainByName")]
        //public async Task<IActionResult> DeleteDomain(string domainName)
        //{
        //    var domain_exists = await _context.CustomersDomains.FirstOrDefaultAsync(d => d.DomainName == domainName);

        //    if(domain_exists != null)
        //    {
        //      _context.CustomersDomains.Remove(domain_exists);

        //        // If Save OK
        //        if (await _context.SaveChangesAsync() > 0)
        //        {
        //            return StatusCode(200, $"Domain {domain_exists.DomainName} was deleted ");
        //        }
        //        return StatusCode(500, $"Failed - to Delete the Domain: {domain_exists.DomainName}");
        //    }
        //    else
        //    {
        //        return StatusCode(404, "Domain does not exists!");
        //    }   
        //}







        //// Delete - Customer Domain by Customer ------------------------------------------------------------------------------------------------------------------------------------------
        //[HttpDelete("{customerId}/{domainName}")]
        //public async Task<IActionResult> DeleteDomain(int customerId, string domainName) // ID = customerId
        //{
        //    var customer_Domain_exists =  await _context.CustomersDomains.Where(d => d.CustomerId == customerId && d.DomainName == domainName).FirstOrDefaultAsync();


        //    if (customer_Domain_exists != null)
        //    {
        //        _context.CustomersDomains.Remove(customer_Domain_exists);

        //        // If Save OK
        //        if (await _context.SaveChangesAsync() > 0)
        //        {
        //            return StatusCode(200, await PrivateGetAllCustomerDomains(customerId));
        //        }
        //        return StatusCode(500, $"Failed - to Delete the Domain: {customer_Domain_exists.DomainName}");
        //    }
        //    else
        //    {
        //        return StatusCode(404, "Domain does not exists on this customer!");
        //    }
        //}












        //// Add - Customers Domains------------------------------------------------------------------------------------------------------------------------------------------
        //[HttpPost]
        //[Route("AddDomains")]
        //public async Task<IActionResult> AddDomains(List<CustomersDomainsModel> customerDomainsList)
        //{
        //    List<string> warningList = new List<string>();

        //    // Check if the domain exists in the DB
        //    foreach (var domain in customerDomainsList)
        //    {
        //      var specificDomain =  await _context.Set<CustomersDomainsModel>().FirstOrDefaultAsync(d => d.Id == domain.Id); /// Get
        //        if(specificDomain == null)
        //        {
        //           await _context.CustomersDomains.AddAsync(domain);
        //        }
        //        else
        //        {
        //            warningList.Add($"Domain: {domain.DomainName} already exist in the DB");
        //        }
        //    }


        //    // If Save OK
        //    if (await _context.SaveChangesAsync() > 0)
        //    {
        //        if(warningList.Count == 0)
        //        {
        //            return StatusCode(200, await PrivateGetAllCustomerDomains(customerDomainsList[0].CustomerId));
        //        }
        //        else
        //        {
        //            return StatusCode(207, warningList);
        //        }
        //    }
        //    return StatusCode(500, "Failed - The Domains could not be added to the DB");
        //}





        //// Get All Customers Domains ------------------------------------------------------------------------------------------------------------------------------------------
        //[HttpGet]
        //[Route("GetAllCustomersDomains")]
        //public async Task<IEnumerable> GetAllCustomersDomains()
        //{
        //  return await _context.Set<CustomersDomainsModel>().ToListAsync();
        //}












        // Get Target -----------------------------------------------------------------------------------------------------------------------------------------
        // Get by URL
        [HttpGet]
        [Route("GetTarget")]
        public async Task<IEnumerable> GetTarget(string target)
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.GetAsync($"https://restapi.e-conomic.com/{target}"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync(); // Result
                    var jsonResult = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(apiResponse); // Get prop from apiResponse
                    return apiResponse;
                }
            }
        }




        //// PRIVATE METHODS----------------------------------------------------------------------------------------------------------------------------------------
        //private async Task<IEnumerable> PrivateGetAllCustomerDomains(int customerId)
        //{
        //    return await _context.CustomersDomains.Where(d => d.CustomerId == customerId).ToListAsync();
        //}


    }
}
