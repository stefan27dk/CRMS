using CRMS.Client.ReactRedux.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.DomainsServices
{
    public interface IDomainsService
    {
        Task<int> AddDomain(CustomersDomainsModel domain);
        Task<int> DeleteDomainByName(string domainName);
        Task<List<CustomersDomainsModel>> GetAllCustomersDomains();
        Task<List<CustomersDomainsModel>> GetCustomerDomains(int customerId);
        Task<CustomersDomainsModel> GetDomainByName(string domainName);
        Task<int> UpdateDomain(CustomersDomainsModel domain);
    }
}