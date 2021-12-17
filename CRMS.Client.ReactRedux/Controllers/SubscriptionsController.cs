using CRMS.Client.ReactRedux.DB;
using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Services.SubscriptionsServices;   
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Controllers
{
    // == || CLASS - SubscriptionsController || ============================================================================================================================== 
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionsController : ControllerBase
    {     
          private readonly ISubscriptionsService _subscriptionsService;


        // Constructor ---------------------------------------------------------------------------------------------------------------------------------------
        public SubscriptionsController(ISubscriptionsService subscriptionsService)
        {    
            _subscriptionsService = subscriptionsService;  
        }





        // Get All - Subscriptions ready for Invoice ---------------------------------------------------------------------------------------------------------------------------- 
        [HttpGet]
        [Route("GetAllReadyForInvoiceSubscriptions")]
        public async Task<IEnumerable> GetAllReadyForInvoiceSubscriptions()
        {
            var subscriptions = _subscriptionsService.GetSubscriptionsReadyForInvoicementAsync();
            return await subscriptions;
        }





        // ADD Subscription ---------------------------------------------------------------------------------------------------------------------------- 
        [HttpPost]
        [Route("AddSubscription")]
        public async Task<IActionResult> AddSubscription(SubscriptionsModel newSubscription)
        {
            if(newSubscription.Validate())
            {
                if(await _subscriptionsService.AddSubscriptionAsync(newSubscription) > 0)
                {
                    return StatusCode(201, await GetAllSubscriptions());
                }
                return StatusCode(500, "Abonnment er Oprettet!");
            }
                return StatusCode(400, "Input er ikke valid!");
        }






        // Get By ID ----------------------------------------------------------------------------------------------------------------------------- 
        [HttpGet]
        [Route("GetSubscriptionByID")]
        public async Task<IActionResult> GetSubscriptionByID(int subscriptionId)
        {
            if (subscriptionId > 0)
            {     
                return StatusCode(200, await _subscriptionsService.GetSubscriptionByIDAsync(subscriptionId));
            }
            return StatusCode(400, "Input er ikke valid - Abonnement ID kan ikke være 0!");
        }
                
     







        // Get By CustomerID ----------------------------------------------------------------------------------------------------------------------------- 
        [HttpGet]
        [Route("GetSubscriptionsByCustomerID")]
        public async Task<IActionResult> GetSubscriptionsByCustomerID(int customerId)
        {
            if (customerId > 0)
            {
                return StatusCode(200, await _subscriptionsService.GetSubscriptionsByCustomerIDAsync(customerId));
            }
            return StatusCode(400, "Input er ikke valid - Kunde ID kan ikke være 0!");
        }







        // Delete ById ----------------------------------------------------------------------------------------------------------------------------- 
        [HttpDelete]
        [Route("DeleteSubscriptionByID")]
        public async Task<IActionResult> DeleteSubscriptionByID(int subscriptionId)
        {
            if (subscriptionId > 0)
            {
                var subscription_deleted = await _subscriptionsService.DeleteSubscriptionByIDAsync(subscriptionId);
               
                if(subscription_deleted == 1)
                {
                    return StatusCode(200, await GetAllSubscriptions());
                }
                else if(subscription_deleted == -1)
                {
                    return StatusCode(400, $"Abonnment med ID: {subscriptionId} eksiter ikke!");
                }
                else if (subscription_deleted == 0)
                {
                    return StatusCode(500, $"Server fejl!");
                }
            }
            return StatusCode(400, "Input er ikke valid - Abonnment ID kan ikke være 0!");
        }





            


        // Get All - Subscriptions ---------------------------------------------------------------------------------------------------------------------------- 
        [HttpGet]
        [Route("GetAllSubscriptions")]
        public async Task<ICollection> GetAllSubscriptions()
        {
            return await _subscriptionsService.GetAllSubscriptionsAsync();
        }







        // Update - Subscriptions Range ---------------------------------------------------------------------------------------------------------------------------- 
        [HttpPut]
        [Route("SubscriptionsUpdateRange")]
        public async Task<IActionResult> SubscriptionsUpdateRange(List<SubscriptionsModel> subscriptionsForUpdate)
        {  
           var subscriptions_updated = await _subscriptionsService.SubscriptionsUpdateRangeAsync(subscriptionsForUpdate);
            if (subscriptions_updated == 1)
            {
                return StatusCode(200, await GetAllSubscriptions());
            }  
            else 
            {
                return StatusCode(500, $"Server fejl!");
            }
        }







        // Update - Subscription ---------------------------------------------------------------------------------------------------------------------------- 
        [HttpPut]
        [Route("UpdateSubscription")]
        public async Task<IActionResult> UpdateSubscription(SubscriptionsModel subscription)
        {
            if(subscription.Validate())
            {
                var subscription_updated = await _subscriptionsService.UpdateSubscriptionAsync(subscription);
               
                if(subscription_updated == 1)
                {
                  return StatusCode(200, await GetAllSubscriptions());
                }
                else if(subscription_updated == -1)
                {
                    return StatusCode(400, $"Abonnment med ID: {subscription.Id} eksiter ikke!");
                }
                else if (subscription_updated == 0)
                {
                    return StatusCode(500, $"Server fejl!");
                }
            }
            return StatusCode(400, "Input er ikke valid!");
        }











        // GetGroupedSubscriptionsByCustomer - Subscription ---------------------------------------------------------------------------------------------------------------------------- 
        [HttpPut]
        [Route("GetGroupedSubscriptionsByCustomer")]
        public async Task<IEnumerable> GetGroupedSubscriptionsByCustomer()
        {
            var readySubscriptions = await _subscriptionsService.GetSubscriptionsReadyForInvoicementAsync();
            var groupedSubscriptions =  await _subscriptionsService.GroupSubscriptionsByCustomerAsync(readySubscriptions);
            return groupedSubscriptions;
        }








        // Make Subscription active---------------------------------------------------------------------------------------------------------------------------- 
        [HttpPost]
        [Route("ActivateSubscription")]
        public async Task<IActionResult> ActivateSubscription(int subscriptionId)
        {
            var subscription_activated = await _subscriptionsService.ActivateSubscriptionAsync(subscriptionId);
            if (subscription_activated == 1)
            {
                return StatusCode(200, "Abonnemnt er Aktiveret!");
            }
            else if (subscription_activated == -1)
            {
                return StatusCode(400, $"Abonnment med ID: {subscriptionId} eksiter ikke - eller er aktiv!");
            }
                return StatusCode(500, $"Server fejl!");
        }
    }
}
