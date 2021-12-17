import * as _ from "lodash";
import store from "../store";
 


  

// Get Product=======================================================================================================================================================
const getProduct = (productId) => {
    let products = store.getState().products.list;

    for (var i = 0; i < products.length; i++) {

        if (products[i].productNumber == productId) {
            return products[i];
        }
    }

};






// #1 - Create Invoice Draft =============================================================================================================================================
export const createInvoiceDrafts = (customers, groupedSubscriptions) => {
    let readyInvoiceDrafts = [];
    let today = new Date().toISOString().split('T')[0]; // Today Date
  
    // Loop - subscriptions
    for (var i = 0; i < groupedSubscriptions.length; i++)
    {
        var customer = customers.list.find(x => x.customerNumber === parseInt(groupedSubscriptions[i].customerId)); // Find customer from the Subscription.CustomerId
            
        let newInvoiceDraft =
        {
            date: today,
            currency: "DKK",

            paymentTerms: {
                paymentTermsNumber: 1,
                daysOfCredit: 14,
                name: "Lobende maned 14 dage",
                paymentTermsType: "net"
            },
            references: {
                other: " "
            },
            layout: {
                layoutNumber: 19
            },
            
        }
        newInvoiceDraft = { ...newInvoiceDraft, ...populateCustomerData(customer, today), ...pupulateProducts(groupedSubscriptions[i].subscriptions) };  // Merge Customer Data and Products to draft

        readyInvoiceDrafts.push(newInvoiceDraft);  // Add to array with ready Invoice Drafts
    };

    return readyInvoiceDrafts;
};







// #2 - Group Subscriptions by Customer =============================================================================================================================================
export const groupSubscriptionsByCustomer = (subscriptionsForInvoicment) => {
    // Group subscriptions by customerID
    let groupedSubscriptions = _.chain(subscriptionsForInvoicment)
        .groupBy("customerId")
        // `key` is group's name (customerId), `value` is the array of objects
        .map((value, key) => ({ customerId: key, subscriptions: value }))
        .value();
    return groupedSubscriptions;
};






// #3 - Populate Customer Data =============================================================================================================================================
const populateCustomerData = (customer, today) => {
    let customerData = {
        customer: {
            customerNumber: customer.customerNumber
        },
        recipient: {
            name: customer.name,
            address: customer.address,
            zip: customer.zip,
            city: customer.city,
            vatZone: {
                name: "Domestic",
                vatZoneNumber: 1,
                enabledForCustomer: true,
                enabledForSupplier: true
            }
        },
        delivery: {
            address: customer.address,
            zip: customer.zip,
            city: customer.city,
            country: "Denmark",
            deliveryDate: today
        },
    };

    //return Object.values(customerData);
    return customerData;
};









// #4 - Populate Products to Invoice Draft =============================================================================================================================================
const pupulateProducts = (groupedSubscriptions) => {
    //let product = {};
    let lines = [];
    //var products = store.getState().products.list;

    for (var y = 0; y < groupedSubscriptions.length; y++)
    {
        //let product = products.find(p => p.productNumber === parseInt(groupedSubscriptions[y].productId));

        let product = getProduct(groupedSubscriptions[y].productId);
          
        lines.push
            ({
                lineNumber: y+1,
                sortKey: 1,
                description: product.name,
                unit: {
                    unitNumber: product.unit.unitNumber,
                    name: product.unit.name
                },
                product: {
                    productNumber: product.productNumber,
                    subscriptionId: groupedSubscriptions[y].id
                },
                quantity: 1.00,
                unitNetPrice: product.salesPrice,
                discountPercentage: 0.00,
                totalNetAmount: product.salesPrice,
            });
    }

    return { lines: lines };
};












 