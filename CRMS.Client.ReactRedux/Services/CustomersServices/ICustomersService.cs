using CRMS.Client.ReactRedux.Models;
using System.Collections;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.CustomersServices
{
    public interface ICustomersService
    {
        Task<int> AddCustomer(JsonElement customer);
        Task<int> CreateContactPerson(JsonElement jsonContact, int customerId);
        Task<int> DeleteContactPerson(int customerId, int contactId);
        Task<int> DeleteCustomerAsync(int customerId);
        Task<List<CustomerModel>> GetAllCustomers();
        Task<List<CustomerModel>> GetAllCustomersWithDomains();
        Task<IEnumerable> GetContactPersons(int customerId);
        Task<CustomerModel> GetCustomerById(int customerId);
        Task<int> UpdateContactPerson(JsonElement jsonContact, int customerId, int contactId);
        Task<int> UpdateCustomer(JsonElement customer, int customerId);
    }
}