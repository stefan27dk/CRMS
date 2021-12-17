using CRMS.Client.ReactRedux.DB;
using CRMS.Client.ReactRedux.Frame;
using CRMS.Client.ReactRedux.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Services.SubscriptionsServices
{
    public class SubscriptionsService : ISubscriptionsService
    {
        private readonly IItlCrmsDbContext _itlCrmsDbContext;
        private readonly IConfiguration _configuration;


        // Constructor ---------------------------------------------------------------------------------------------------------------------------------------
        public SubscriptionsService(IItlCrmsDbContext itlCrmsDbContext, IConfiguration configuration)
        {
            _itlCrmsDbContext = itlCrmsDbContext;
            _configuration = configuration;
        }




        // Get Subscriptions For Invocement----------------------------------------------------------------------------------------------------------------------------- 
        public async Task<List<SubscriptionsModel>> GetSubscriptionsReadyForInvoicementAsync()
        {
            var subsReadyForInvoice = new List<SubscriptionsModel>();
            int daysBefore = _configuration.GetValue<int>("InvoicementNotificationSettings:DaysBefore");
            var subscriptions = await _itlCrmsDbContext.Set<SubscriptionsModel>().ToListAsync();
            var date = DateTime.Now.AddDays(daysBefore);

            var count = subscriptions.Count;
            for (int i = 0; i < count; i++)
            {
                if (subscriptions[i].PeriodEndDate.Date <= date.Date)
                {
                    subsReadyForInvoice.Add(subscriptions[i]);
                }
            }
            return subsReadyForInvoice;
        }






        // Create Subscription ---------------------------------------------------------------------------------------------------------------------------- 
        public async Task<int> AddSubscriptionAsync(SubscriptionsModel newSubscription)
        {
            await _itlCrmsDbContext.Set<SubscriptionsModel>().AddAsync(newSubscription);

            // If Saved
            if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
            {
                return 1;
            }
            return 0;
        }







        // Get By ID ----------------------------------------------------------------------------------------------------------------------------- 
        public async Task<SubscriptionsModel> GetSubscriptionByIDAsync(int subscriptionId)
        {
            return await _itlCrmsDbContext.Set<SubscriptionsModel>().FirstOrDefaultAsync(s => s.Id == subscriptionId);
        }



        // Get By CustomerID ----------------------------------------------------------------------------------------------------------------------------- 
        public async Task<List<SubscriptionsModel>> GetSubscriptionsByCustomerIDAsync(int customerId)
        {
            return await _itlCrmsDbContext.Set<SubscriptionsModel>().Where(s => s.CustomerId == customerId).ToListAsync();
        }




        // Delete ById ----------------------------------------------------------------------------------------------------------------------------- 
        public async Task<int> DeleteSubscriptionByIDAsync(int subscriptionId)
        {
            var subscription_exists = await _itlCrmsDbContext.Set<SubscriptionsModel>().FirstOrDefaultAsync(s => s.Id == subscriptionId);

            if (subscription_exists != null)
            {
                _itlCrmsDbContext.Set<SubscriptionsModel>().Remove(subscription_exists);
                // If Save OK
                if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
                {
                    return 1;
                }
                return 0;
            }
            return -1;
        }








        // Get All - Subscriptions ---------------------------------------------------------------------------------------------------------------------------- 
        public async Task<List<SubscriptionsModel>> GetAllSubscriptionsAsync()
        {
            return await _itlCrmsDbContext.Set<SubscriptionsModel>().ToListAsync();
        }




        // Update - Subscription ---------------------------------------------------------------------------------------------------------------------------- 
        public async Task<int> UpdateSubscriptionAsync(SubscriptionsModel subscription)
        {
            var subscription_exists = await _itlCrmsDbContext.Set<SubscriptionsModel>().FirstOrDefaultAsync(s => s.Id == subscription.Id);

            // If Exists in the DB Update it
            if (subscription_exists != null)
            {
                _itlCrmsDbContext.Entry(subscription_exists).CurrentValues.SetValues(subscription);  // Update / Replace Values

                // Save OK
                if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
                {
                    return 1;
                }
                return 0;
            }
            return -1;
        }









        // Update - Subscriptions ---------------------------------------------------------------------------------------------------------------------------- 
        public async Task<int> SubscriptionsUpdateRangeAsync(List<SubscriptionsModel> subscriptionsForUpdate)
        {
            _itlCrmsDbContext.Set<SubscriptionsModel>().UpdateRange(subscriptionsForUpdate);

            // If Save OK
            if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
            {
                return 1;
            }
            return 0;
        }









        // Renew - Subscription ---------------------------------------------------------------------------------------------------------------------------------------
        public async Task<SubscriptionsModel> RenewSubscriptionAsync(int subscriptionID)
        {
            // Get
            var subscription_exists = await _itlCrmsDbContext.Set<SubscriptionsModel>().FirstOrDefaultAsync(s => s.Id == subscriptionID);

            // If Exists in the DB  
            if (subscription_exists != null)
            {
                // Today - Date
                string todayString = DateTime.Now.ToString("yyyy-MM-dd");
                DateTime today = DateTime.ParseExact(todayString, "yyyy-MM-dd", CultureInfo.InvariantCulture);


                // Map
                SubscriptionsModel subscriptionRenew = new SubscriptionsModel();
                subscriptionRenew.Id = subscription_exists.Id;
                subscriptionRenew.Quantity = subscription_exists.Quantity;
                subscriptionRenew.DomainId = subscription_exists.DomainId;
                subscriptionRenew.BillingPeriodType = subscription_exists.BillingPeriodType;
                subscriptionRenew.CreationDate = subscription_exists.CreationDate;
                subscriptionRenew.PeriodStartDate = today;
                subscriptionRenew.LastInvoiced = today;
                subscriptionRenew.ProductId = subscription_exists.ProductId;
                subscriptionRenew.CustomerId = subscription_exists.CustomerId;
                subscriptionRenew.Description = subscription_exists.Description;


                //  Billing Period - Yearly, Semiannual, Quarterly, Monthly
                // Yearly
                if (subscription_exists.BillingPeriodType == BillingPeriodType.Yearly)
                {
                    // End - Date
                    string endDateString = DateTime.Today.AddYears(+1).ToString("yyyy-MM-dd");
                    DateTime endDateYear = DateTime.ParseExact(endDateString, "yyyy-MM-dd", CultureInfo.InvariantCulture);

                    subscriptionRenew.PeriodEndDate = endDateYear;
                }
                // Semiannual
                else if (subscription_exists.BillingPeriodType == BillingPeriodType.Semiannual)
                {
                    // End - Date
                    string endDateString = DateTime.Today.AddMonths(+6).ToString("yyyy-MM-dd");
                    DateTime endDateSemiannual = DateTime.ParseExact(endDateString, "yyyy-MM-dd", CultureInfo.InvariantCulture);

                    subscriptionRenew.PeriodEndDate = endDateSemiannual;
                }
                // Quarterly
                else if (subscription_exists.BillingPeriodType == BillingPeriodType.Quarterly)
                {
                    // End - Date
                    string endDateString = DateTime.Today.AddMonths(+3).ToString("yyyy-MM-dd");
                    DateTime endDateQuarterly = DateTime.ParseExact(endDateString, "yyyy-MM-dd", CultureInfo.InvariantCulture);

                    subscriptionRenew.PeriodEndDate = endDateQuarterly;
                }
                // Monthly
                else
                {
                    // End - Date
                    string endDateString = DateTime.Today.AddMonths(+1).ToString("yyyy-MM-dd");
                    DateTime endDateMonthly = DateTime.ParseExact(endDateString, "yyyy-MM-dd", CultureInfo.InvariantCulture);

                    subscriptionRenew.PeriodEndDate = endDateMonthly;
                }
                return subscriptionRenew;
            }

            return null;
        }










        // Update - RenewedSubscription ---------------------------------------------------------------------------------------------------------------------------------------
        public async Task<int> UpdateRenewetSubscriptionAsync(SubscriptionsModel subscriptionToUpdate)
        {
            var subscription_exists = await _itlCrmsDbContext.Set<SubscriptionsModel>().FirstOrDefaultAsync(s => s.Id == subscriptionToUpdate.Id);

            // If Exists in the DB Update it
            if (subscription_exists != null)
            {
                _itlCrmsDbContext.Entry(subscription_exists).CurrentValues.SetValues(subscriptionToUpdate);  // Update / Replace Values

                // Save OK
                if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
                {
                    return 1;
                }
                return 0;
            }
            return -1;
        }










        // GroupSubscriptions By Customer ----------------------------------------------------------------------------------------------------------------------------------
        public Task<Dictionary<int, List<SubscriptionsModel>>> GroupSubscriptionsByCustomerAsync(List<SubscriptionsModel> subscriptions)
        {
            var groupedSubscriptions = new Dictionary<int, List<SubscriptionsModel>>(); // Dictionary to hold groped subscriptions

            // Create Grouped Subscriptions - Loop Subscriptions
            foreach (var subscription in subscriptions)
            {
                var dict_key_exists = groupedSubscriptions.FirstOrDefault(c => c.Key == subscription.CustomerId); // Check if Cutomer Id already exists in dictionary as key

                if (dict_key_exists.Key == subscription.CustomerId) // If CustId exists in dict add the subscription there
                {
                    dict_key_exists.Value.Add(subscription);
                }
                else if (dict_key_exists.Key == 0) // If does not exists
                {
                    groupedSubscriptions.Add(subscription.CustomerId, new List<SubscriptionsModel>() { subscription });
                }
            }
            return Task.FromResult(groupedSubscriptions);
        }












        // Make Subscription active---------------------------------------------------------------------------------------------------------------------------- 
        public async Task<int> ActivateSubscriptionAsync(int subscriptionId)
        {

            // GET
            var subscription_exists = await _itlCrmsDbContext.Set<SubscriptionsModel>().FirstOrDefaultAsync(s => s.Id == subscriptionId);

            if (subscription_exists != null)
            {
                // Active dates
                string todayString = DateTime.Now.ToString("yyyy-MM-dd");
                DateTime today = DateTime.ParseExact(todayString, "yyyy-MM-dd", CultureInfo.InvariantCulture);

                string createdString = DateTime.Today.AddYears(-1).ToString("yyyy-MM-dd");
                DateTime created = DateTime.ParseExact(createdString, "yyyy-MM-dd", CultureInfo.InvariantCulture);

                // Map Obj
                SubscriptionsModel subscriptionModelToUpdate = new SubscriptionsModel
                {
                    Id = subscription_exists.Id,
                    Quantity = subscription_exists.Quantity,
                    DomainId = subscription_exists.DomainId,
                    BillingPeriodType = subscription_exists.BillingPeriodType,
                    CreationDate = created,
                    PeriodStartDate = created,
                    PeriodEndDate = today,
                    LastInvoiced = created,
                    ProductId = subscription_exists.ProductId,
                    CustomerId = subscription_exists.CustomerId,
                    Description = subscription_exists.Description
                };


                // If Exists in the DB Update it
                if (subscription_exists != null)
                {
                    _itlCrmsDbContext.Entry(subscription_exists).CurrentValues.SetValues(subscriptionModelToUpdate);  // Update / Replace Values

                    // Save OK
                    if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
                    {
                        return 1;
                    }
                    return 0;
                }
            }
            return -1;
        }
    }
}
