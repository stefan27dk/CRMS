using CRMS.Client.ReactRedux.DB;
using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Overloads;
using CRMS.Client.ReactRedux.Services.DomainsServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Controllers
{
    // == || CLASS - Customer || ============================================================================================================================== 
    [Route("api/[controller]")]
    [ApiController]
    public class DomainsController : ControllerBase
    {     
        private readonly IDomainsService _domainsService;


        // Constructor ---------------------------------------------------------------------------------------------------------------------------------------
        public DomainsController(IDomainsService domainsService)
        {   
            _domainsService = domainsService;
        }



        // DOMAINS =======================================================================================================================================================
        // Get - Customer Domains------------------------------------------------------------------------------------------------------------------------------------------
        [HttpGet]
        [Route("GetCustomerDomains")]
        public async Task<IActionResult> GetCustomerDomains(int customerId)
        {
            if(customerId != 0)
            { 
              return StatusCode(200, await _domainsService.GetCustomerDomains(customerId));
            }
            return StatusCode(400, "Invalid Input!"); 
        }





        // Get All Customers Domains ------------------------------------------------------------------------------------------------------------------------------------------
        [HttpGet]
        [Route("GetAllCustomersDomains")]
        public async Task<IEnumerable> GetAllCustomersDomains()
        {
            return await _domainsService.GetAllCustomersDomains();
        }





        // Get - Domain by Name------------------------------------------------------------------------------------------------------------------------------------------
        [HttpGet]
        [Route("GetDomainByName")]
        public async Task<IActionResult> GetDomainByName(string domainName)
        {
            if(!string.IsNullOrWhiteSpace(domainName))
            {
               return StatusCode(200, await _domainsService.GetDomainByName(domainName));
            }
            return StatusCode(400, "Invalid Input!");
        }




        // Add - Customer Domain------------------------------------------------------------------------------------------------------------------------------------------
        [Authorize(Roles = "user, admin")]
        [HttpPost]
        [Route("AddDomain")]
        public async Task<IActionResult> AddDomain(CustomersDomainsModel domain)
        {
           if(domain.ValidateWithoutId())
           {   
              var domain_added =  await _domainsService.AddDomain(domain);
              
              if(domain_added == 1)
              {
                 //return StatusCode(200, new { customerDomain = domain, allDomains = await GetAllCustomersDomains() });
                 return StatusCode(200, domain);
              }
              else if(domain_added == -1)
              {
                 return StatusCode(200, $"Domæne: {domain.DomainName} allerade eksiter!");
              }
                return StatusCode(409, $"Server Fejl - Domæne: {domain.DomainName} blev ikke oprettet!");
           }
                return StatusCode(409, "Invalid Input!");
        }







        //// Add - Customer Domains------------------------------------------------------------------------------------------------------------------------------------------
        //[HttpPost]
        //[Route("AddDomains")]
        //public async Task<IActionResult> AddDomains(List<CustomersDomainsModel> customerDomainsList)
        //{
        //    List<string> warningList = new List<string>();

        //    // Check if the domain exists in the DB
        //    foreach (var domain in customerDomainsList)
        //    {
        //        var specificDomain = await _context.Set<CustomersDomainsModel>().FirstOrDefaultAsync(d => d.DomainName == domain.DomainName); /// Get
        //        if (specificDomain == null)
        //        {
        //            await _context.CustomersDomains.AddAsync(domain);
        //        }
        //        else
        //        {
        //            warningList.Add($"Domain: {domain.DomainName} already exist in the DB");
        //        }
        //    }


        //    // If Save OK
        //    if (await _context.SaveChangesAsync() > 0)
        //    {
        //        if (warningList.Count == 0)
        //        {
        //            return StatusCode(200,  new { CustomerDomains = await GetCustomerDomains(customerDomainsList[0].CustomerId), AllDomains = await GetAllCustomersDomains()});
        //        }                                                                                               
        //        else                                
        //        {
        //            return StatusCode(207, warningList);
        //        }
        //    }
        //    return StatusCode(500, "Failed - The Domains could not be added to the DB");
        //}





        [Authorize(Roles = "user, admin")]
        [HttpPut]
        [Route("UpdateDomain")]
        public async Task<IActionResult> UpdateDomain(CustomersDomainsModel domain)
        {
            if (domain.ValidateAll())
            {
                var domain_updated = await _domainsService.UpdateDomain(domain);

                if (domain_updated == 1)
                {
                    return StatusCode(200, await GetAllCustomersDomains());
                }
                else if (domain_updated == -1)
                {
                    return StatusCode(200, $"Domæne: {domain.DomainName} allerade eksiter!");
                }
                return StatusCode(409, $"Server Fejl - Domæne: {domain.DomainName} blev ikke Opdateret!");
            }
            return StatusCode(409, "Invalid Input!");
        }












        //[HttpPut]
        //[Route("UpdateDomainByName")]
        //public async Task<IActionResult> UpdateDomainByName(string domainName)
        //{
        //    var domain_exists= await _context.CustomersDomains.FirstOrDefaultAsync(d => d.DomainName == domainName);
        //    if (domain_exists == null)
        //    {
        //        var modifiedDomain = new CustomersDomainsModel();
        //        modifiedDomain.Id = domain_exists.Id;
        //        modifiedDomain.DomainName = domain_exists.DomainName;
        //        modifiedDomain.CustomerId = domain_exists.CustomerId;

        //        _context.Entry(domain_exists).CurrentValues.SetValues(modifiedDomain);
        //        if (await _context.SaveChangesAsync() > 0)
        //        {
        //            return (StatusCode(200, await GetCustomerDomains(modifiedDomain.CustomerId)));
        //        }
        //        return StatusCode(500, $"Domæne med navn \"{modifiedDomain.DomainName}\" kunne ikke opdateres! Intern Fejl!");
        //    }
        //    return StatusCode(500, $"Domæne med navn \"{domainName}\" eksister i forvejen!");
        //}












        // Delete - Customer Domain by Name ------------------------------------------------------------------------------------------------------------------------------------------
        [Authorize(Roles = "user, admin")]
        [HttpDelete]
        [Route("DeleteDomainByName")]
        public async Task<IActionResult> DeleteDomainByName(string domainName)
        {
            if (!string.IsNullOrWhiteSpace(domainName))
            {
                var mail_deleted = await _domainsService.DeleteDomainByName(domainName);

                if (mail_deleted == 1)
                {
                    return StatusCode(200, await GetAllCustomersDomains());
                }
                else if (mail_deleted == -1)
                {
                    return StatusCode(200, $"Domæne: {domainName} eksiter ikke!");
                }
                return StatusCode(200, $"Server Fejl - Domæne: {domainName} blev ikke Slettet!");
            }
            return StatusCode(400, $"Invalid Input!");
        }







        //// Delete - Customer Domain by Customer ------------------------------------------------------------------------------------------------------------------------------------------
        //[HttpDelete]
        //[Route("DeleteDomainByCustomerID")]
        //public async Task<IActionResult> DeleteDomainByCustomerID(int customerId, string domainName) // ID = customerId
        //{
        //    if (!string.IsNullOrWhiteSpace(domainName) && customerId > 0)
        //    {
        //        var mail_deleted = await _domainsService.DeleteDomainByName(domainName);

        //        if (mail_deleted == 1)
        //        {
        //            return StatusCode(200, await GetAllCustomersDomains());
        //        }
        //        else if (mail_deleted == -1)
        //        {
        //            return StatusCode(200, $"Domæne: {domainName} eksiter ikke!");
        //        }
        //        return StatusCode(200, $"Server Fejl - Domæne: {domainName} blev ikke Slettet!");
        //    }
        //    return StatusCode(400, $"Invalid Input!");
        //}













 





        //// PRIVATE METHODS ####################################################################################################################################################
        //private async Task<IEnumerable> PrivateGetAllCustomerDomains(int customerId)
        //{
        //    return await _context.CustomersDomains.Where(d => d.CustomerId == customerId).ToListAsync();
        //}


    }
}
