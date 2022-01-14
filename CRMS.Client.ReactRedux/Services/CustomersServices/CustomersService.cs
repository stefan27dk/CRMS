using CRMS.Client.ReactRedux.DB;
using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Overloads;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.CustomersServices
{
    public class CustomersService : ICustomersService
    {
        // DB Context
        private readonly IItlCrmsDbContext _context;

        // Constructor ---------------------------------------------------------------------------------------------------------------------------------------
        public CustomersService(IItlCrmsDbContext context)
        {
            _context = context;
        }




        // Get ALL - Customers With Domains ----------------------------------------------------------------------------------------------------------------------------------
        public async Task<List<CustomerModel>> GetAllCustomersWithDomains()
        {
            var allDomains = await _context.Set<CustomersDomainsModel>().ToListAsync();
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.GetAsync(EconomicsHttpClientHandler.eConomicsApiAddress + "/Customers?pagesize=1000"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string content = await response.Content.ReadAsStringAsync(); // Result
                        CustomersListModel customers = System.Text.Json.JsonSerializer.Deserialize<CustomersListModel>(content); // Get prop from apiResponse

                        foreach (var customer in customers.collection)
                        {
                            customer.domains = allDomains.Where(d => d.CustomerId == customer.customerNumber).ToList();
                        }

                        return customers.collection;
                    }
                    return null;
                }
            }
        }






        // Get ALL - Customers ----------------------------------------------------------------------------------------------------------------------------------
        public async Task<List<CustomerModel>> GetAllCustomers()
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.GetAsync(EconomicsHttpClientHandler.eConomicsApiAddress + "/Customers?pagesize=1000"))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync(); // Result
                    CustomersListModel customers = System.Text.Json.JsonSerializer.Deserialize<CustomersListModel>(apiResponse); // Get prop from apiResponse
                    return customers.collection;
                }
            }
        }









        // Get - Customer ------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<CustomerModel> GetCustomerById(int customerId)
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.GetAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/Customers/{customerId}"))
                {
                    string content = await response.Content.ReadAsStringAsync(); // Result

                    if (response.IsSuccessStatusCode)
                    {
                        var customer = System.Text.Json.JsonSerializer.Deserialize<CustomerModel>(content); // Get prop from apiResponse
                        return customer;
                    }
                    return null;
                }
            }
        }









        // Add - Customer ------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> AddCustomer(JsonElement customer)
        {
            var content = new StringContent(customer.ToString(), System.Text.Encoding.UTF8, "application/json");
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.PostAsync(EconomicsHttpClientHandler.eConomicsApiAddress + "/customers", content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        return 1;
                    }
                    return 0;
                }
            }
        }












        // Update - Customer ------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> UpdateCustomer(JsonElement customer, int customerId)
        {
            var content = new StringContent(customer.ToString(), System.Text.Encoding.UTF8, "application/json");
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.PutAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/Customers/{customerId}", content))
                {
                   //var body =  response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                }
            }
        }




        //###################################################################################################################################################################
        // CONTACT PERSONS =======================================================================================================================================================
        // Get - Customer Contact Persons------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<IEnumerable> GetContactPersons(int customerId)
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.GetAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/Customers/{customerId}/contacts"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        string content = await response.Content.ReadAsStringAsync(); // Result
                        var result = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(content).GetProperty("collection"); // Get prop from apiResponse
                        return result.EnumerateArray();
                    }
                    return null;
                }
            }
        }






        // Delete - Customer Contact Person ------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> DeleteContactPerson(int customerId, int contactId) // ID = customerId
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.DeleteAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/customers/{customerId}/contacts/{contactId}"))
                {
                    // If Ok
                    if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                }
            }
        }







        // Update - Customer Contact Person ------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> UpdateContactPerson(JsonElement jsonContact, int customerId, int contactId)
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.PutAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/Customers/{customerId}/contacts/{contactId}", 
                    new StringContent(jsonContact.ToString(), Encoding.UTF8, "application/json")))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                }
            }
        }







        // Create - Customer Contact Person ------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> CreateContactPerson(JsonElement jsonContact, int customerId)
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.PostAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/Customers/{customerId}/contacts", 
                    new StringContent(jsonContact.ToString(), Encoding.UTF8, "application/json")))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                }
            }
        }







        // DELETE - Customer ----------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> DeleteCustomerAsync(int customerId)
        {
            using (var httpClient = new EconomicsHttpClientHandler())
            {
                using (var response = await httpClient.DeleteAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/customers/{customerId}"))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        return 1;
                    }
                    return 0;
                }
            }
        }

        // EXTRAS ===================================================================================================


        //// Create - Customer Contact Person ------------------------------------------------------------------------------------------------------------------------------------------
        //[HttpPost("{customerId}/ContactPersons")]
        //public async Task<IActionResult> CreateContactPerson([FromBody] JsonElement jsonContact, int customerId)
        //{
        //    using (var httpClient = new EconomicsHttpClientHandler())
        //    {
        //        using (var response = await httpClient.PostAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/Customers/{customerId}/contacts", new StringContent(jsonContact.ToString(), Encoding.UTF8, "application/json")))
        //        {
        //            if (response.IsSuccessStatusCode)
        //            {
        //                return StatusCode(200, await GetContactPersons(customerId));
        //            }
        //            else
        //            {
        //                return StatusCode(((int)response.StatusCode), response.Content);
        //            }
        //        }
        //    }
        //}
        //// Update - Customer Contact Person ------------------------------------------------------------------------------------------------------------------------------------------
        //[HttpPut("{customerId}/ContactPersons/{contactId}")]
        //public async Task<IActionResult> UpdateContactPersons([FromBody] JsonElement jsonContact, int customerId, int contactId)
        //{
        //    using (var httpClient = new EconomicsHttpClientHandler())
        //    {
        //        using (var response = await httpClient.PutAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/Customers/{customerId}/contacts/{contactId}", new StringContent(jsonContact.ToString(), Encoding.UTF8, "application/json")))
        //        {

        //            if (response.IsSuccessStatusCode)
        //            {
        //                return StatusCode(200, await GetContactPersons(customerId));
        //            }
        //            else
        //            {
        //                return StatusCode(((int)response.StatusCode), response.Content);
        //            }
        //        }
        //    }
        //}


        // Update - Customer ------------------------------------------------------------------------------------------------------------------------------------------
        //[HttpPut]
        //[Route("{customerId}/UpdateCustomer")]
        //public async Task<IActionResult> UpdateCustomer([FromBody] JsonElement jsonCustomer, string customerId)
        //{
        //    var content = new StringContent(jsonCustomer.ToString(), System.Text.Encoding.UTF8, "application/json");
        //    using (var httpClient = new EconomicsHttpClientHandler())
        //    {
        //        using (var response = await httpClient.PutAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/Customers/{customerId}", content))
        //        {
        //            if (response.IsSuccessStatusCode)
        //            {
        //                return StatusCode(201, new { Customer = await GetById(customerId), Customers = await GetAll() });
        //            }
        //            else
        //            {
        //                return StatusCode(((int)response.StatusCode), "Failed: Could not update customer!");
        //            }
        //        }
        //    }
        //}




        // GET ALL CUSTOMERS WITHOUT MODEL
        //// Get ALL - Customers ----------------------------------------------------------------------------------------------------------------------------------
        //[HttpGet]
        //[Route("GetAllCustomers")]
        //public async Task<IEnumerable> GetAllCustomers()
        //{
        //    using (var httpClient = new EconomicsHttpClientHandler())
        //    {
        //        using (var response = await httpClient.GetAsync(EconomicsHttpClientHandler.eConomicsApiAddress + "/Customers?pagesize=1000"))
        //        {
        //            string apiResponse = await response.Content.ReadAsStringAsync(); // Result

        //            var jsonResult = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(apiResponse).GetProperty("collection"); // Get prop from apiResponse
        //            return jsonResult.EnumerateArray();
        //        }
        //    }
        //}








        //// Get - Customer ------------------------------------------------------------------------------------------------------------------------------------------
        //[HttpGet("{customerId}")]
        //public async Task<JsonElement> GetById(string customerId)
        //{
        //    using (var httpClient = new EconomicsHttpClientHandler())
        //    {
        //        using (var response = await httpClient.GetAsync(EconomicsHttpClientHandler.eConomicsApiAddress + $"/Customers/{customerId}"))
        //        {
        //            string apiResponse = await response.Content.ReadAsStringAsync(); // Result                 
        //            var jsonResult = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(apiResponse); // Get prop from apiResponse
        //            return jsonResult;
        //        }
        //    }
        //}





        //// Add - Customer ------------------------------------------------------------------------------------------------------------------------------------------
        //[HttpPost]
        //[Route("AddCustomer")]
        //public async Task<IActionResult> AddCustomer([FromBody] JsonElement jsonCustomer)
        //{
        //    var content = new StringContent(jsonCustomer.ToString(), System.Text.Encoding.UTF8, "application/json");
        //    using (var httpClient = new EconomicsHttpClientHandler())
        //    {
        //        using (var response = await httpClient.PostAsync(EconomicsHttpClientHandler.eConomicsApiAddress + "/Customers", content))
        //        {
        //            if (response.IsSuccessStatusCode)
        //            {
        //                return StatusCode(201, await GetAll());
        //            }
        //            else
        //            {
        //                return StatusCode(((int)response.StatusCode), "Failed: Could not add customer!");
        //            }
        //        }
        //    }
        //}

    }
}
