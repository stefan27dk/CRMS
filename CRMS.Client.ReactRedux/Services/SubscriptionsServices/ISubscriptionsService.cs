using CRMS.Client.ReactRedux.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.SubscriptionsServices
{
    public interface ISubscriptionsService
    {
        Task<int> ActivateSubscriptionAsync(int subscriptionId);
        Task<int> AddSubscriptionAsync(SubscriptionsModel newSubscription);
        Task<int> DeleteSubscriptionByIDAsync(int subscriptionId);
        Task<List<SubscriptionsModel>> GetAllSubscriptionsAsync();
        Task<SubscriptionsModel> GetSubscriptionByIDAsync(int subscriptionId);
        Task<List<SubscriptionsModel>> GetSubscriptionsByCustomerIDAsync(int customerId);
        Task<List<SubscriptionsModel>> GetSubscriptionsReadyForInvoicementAsync();
        Task<Dictionary<int, List<SubscriptionsModel>>> GroupSubscriptionsByCustomerAsync(List<SubscriptionsModel> subscriptions);
        Task<SubscriptionsModel> RenewSubscriptionAsync(int subscriptionID);
        Task<int> SubscriptionsUpdateRangeAsync(List<SubscriptionsModel> subscriptionsForUpdate);
        Task<int> UpdateRenewetSubscriptionAsync(SubscriptionsModel subscriptionToUpdate);
        Task<int> UpdateSubscriptionAsync(SubscriptionsModel subscription);
    }
}