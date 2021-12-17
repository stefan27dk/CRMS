import React from 'react';


 

 
// Subscriptions Status Green ===================================================================================================================================
export function getSubscriptionsForInvoicement(subscriptions) {
    let subscriptionsForInvoicement = [];

    // Today - Date
    const today = new Date().toISOString().slice(0, 10);

    // Subscriptions loop
    for (var e = 0; e < subscriptions.length; e++)
    {
        // Subscription End - Date
        const subscriptionEndDate = subscriptions[e].periodEndDate.substring(0, 10);
        if (subscriptionEndDate === today)  // If End date today
        {
            subscriptionsForInvoicement.push(subscriptions[e]); // Add Subscriptions to array if green
        }
    }

    return subscriptionsForInvoicement;
}


      




// Delete Customer Subscription =============================================================================================================
export const deleteSubscriptionLogic = (subscriptionId, deleteSubscriptionAction) => {
    let result = window.confirm(`Vil du slette abonnement med ID:  ${subscriptionId} ?`);
    if (result) {
        deleteSubscriptionAction(subscriptionId);
    }
}


 


// Get Subscriptions Values - Price .kr  ===================================================================================================================
export const getSubscriptionsValues = (subscriptions, products) => {
    let totalYearValue = 0;
    let monthlyValue = 0;
    for (var i = 0; i < subscriptions.length; i++) {
        let product = products.filter(p => p.productNumber == subscriptions[i].productId);
        totalYearValue += product[0].salesPrice * subscriptions[i].quantity * 12;
        monthlyValue += product[0].salesPrice * subscriptions[i].quantity;
    }
    return { yearly: totalYearValue, monthly: monthlyValue };
}






export const subscriptionsTotalValuesHTML = (txtBefore, yearly, monthly) =>
{
    return (
        <span id="customerSubsTotalValues" className="inline ml-4 m-t-b-auto no-wrap font-weight-bold">{txtBefore} Årlig: <u>{yearly + ' kr.'}</u><span className="mr-3 ml-3">&</span>Mdl: <u>{monthly + ' kr.'}</u></span>
    );
}