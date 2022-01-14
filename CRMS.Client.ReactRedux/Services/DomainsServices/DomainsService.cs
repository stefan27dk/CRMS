using CRMS.Client.ReactRedux.DB;
using CRMS.Client.ReactRedux.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.DomainsServices
{
    public class DomainsService : IDomainsService
    {
        private readonly IItlCrmsDbContext _itlCrmsDbContext;

        public DomainsService(IItlCrmsDbContext itlCrmsDbContext)
        {
            _itlCrmsDbContext = itlCrmsDbContext;
        }



        // Get - Customer Domains------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<List<CustomersDomainsModel>> GetCustomerDomains(int customerId)
        {
            return await _itlCrmsDbContext.Set<CustomersDomainsModel>().Where(d => d.CustomerId == customerId).ToListAsync();
        }



        // Get All Customers Domains ------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<List<CustomersDomainsModel>> GetAllCustomersDomains()
        {
            return await _itlCrmsDbContext.Set<CustomersDomainsModel>().ToListAsync();
        }




        // Get - Domain by Name------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<CustomersDomainsModel> GetDomainByName(string domainName)
        {
            return await _itlCrmsDbContext.Set<CustomersDomainsModel>().Where(d => d.DomainName == domainName).FirstOrDefaultAsync();
        }




        // Add - Customer Domain------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> AddDomain(CustomersDomainsModel domain)
        {

            var specificDomain = await _itlCrmsDbContext.Set<CustomersDomainsModel>().FirstOrDefaultAsync(d => d.DomainName == domain.DomainName); /// Get Domain if exists
            if (specificDomain == null)
            {
                await _itlCrmsDbContext.Set<CustomersDomainsModel>().AddAsync(domain);
                if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
                {
                    return 1;
                }
                return 0;
            }
            return -1;
        }






        // Update - Customer Domain------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> UpdateDomain(CustomersDomainsModel domain)
        {
            var domain_Name_exists = await _itlCrmsDbContext.Set<CustomersDomainsModel>().FirstOrDefaultAsync(d => d.DomainName == domain.DomainName);

            if (domain_Name_exists == null)
            {
                var domain_exists = await _itlCrmsDbContext.Set<CustomersDomainsModel>().FirstOrDefaultAsync(d => d.Id == domain.Id);
                _itlCrmsDbContext.Entry(domain_exists).CurrentValues.SetValues(domain);  // Update / Replace Values

                // Save OK
                if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
                {
                    return 1;
                }
                return 0;
            }
            return -1; // DomainName exists, cant update to this domain name.
        }









        // Delete - Customer Domain by Name ------------------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> DeleteDomainByName(string domainName)
        {
            var domain_exists = await _itlCrmsDbContext.Set<CustomersDomainsModel>().FirstOrDefaultAsync(m => m.DomainName == domainName);

            if (domain_exists != null)
            {
                _itlCrmsDbContext.Set<CustomersDomainsModel>().Remove(domain_exists);

                // If Save OK
                if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
                {
                    return 1;
                }
                return 0;
            }
            return -1;
        }




        //// Delete - Customer Domain by Name ------------------------------------------------------------------------------------------------------------------------------------------
        //public async Task<int> DeleteDomainByCustomerID(int customerId, string domainName)
        //{
        //    var domain_exists = await _itlCrmsDbContext.Set<CustomersDomainsModel>().Where(d => d.CustomerId == customerId && d.DomainName == domainName).FirstOrDefaultAsync();

        //    if (domain_exists != null)
        //    {
        //        _itlCrmsDbContext.Set<CustomersDomainsModel>().Remove(domain_exists);

        //        // If Save OK
        //        if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
        //        {
        //            return 1;
        //        }
        //        return 0;
        //    }
        //    return -1;
        //}


    }
}
