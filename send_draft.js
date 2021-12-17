   //// Create Invoice Draft =============================================================================================================================================
    //createInvoiceDraft = () =>
    //{
    //    let subscriptionsForInvoicment = getSubscriptionsForInvoicement(store.getState().subscriptions.list);

    //   let today = new Date().toISOString().split('T')[0];
    //   let invoiceDrafts = [];
    //   let readyinvoiceDrafts = [];


    //    for (var i = 0; i < subscriptionsForInvoicment.length; i++)
    //    {
    //        // Get
    //        let product = this.getProduct(subscriptionsForInvoicment[i].productId);
    //        let customer = this.getCustomer(subscriptionsForInvoicment[i].customerId);


    //        let newInvoiceDraft = {
    //            date: today,
    //            currency: "DKK",

    //            paymentTerms: {
    //                paymentTermsNumber: 1,
    //                daysOfCredit: 14,
    //                name: "Lobende maned 14 dage",
    //                paymentTermsType: "net"
    //            },
    //            customer: {
    //                customerNumber: subscriptionsForInvoicment[i].customerId
    //            },
    //            recipient: {
    //                name: customer.name,
    //                address: customer.address,
    //                zip: customer.zip,
    //                city: customer.city,
    //                vatZone: {
    //                    name: "Domestic",
    //                    vatZoneNumber: 1,
    //                    enabledForCustomer: true,
    //                    enabledForSupplier: true
    //                }
    //            },
    //            delivery: {
    //                address: customer.address,
    //                zip: customer.zip,
    //                city: customer.city,
    //                country: "Denmark",
    //                deliveryDate: today
    //            },
    //            references: {
    //                other: " "
    //            },
    //            layout: {
    //                layoutNumber: 19
    //            },
    //            lines: [
    //                {
    //                    lineNumber: 1,
    //                    sortKey: 1,
    //                    description: product.name,
    //                    unit: {
    //                        unitNumber: 1,
    //                        name: ""
    //                    },
    //                    product: {           
    //                        productNumber: subscriptionsForInvoicment[i].productId.toString()
    //                    },
    //                    quantity: 1.00,
    //                    unitNetPrice: product.salesPrice,
    //                    discountPercentage: 0.00,
    //                    totalNetAmount: product.salesPrice,
    //                }
    //            ]
    //        };


    //        invoiceDrafts.push(newInvoiceDraft); // Add Draft to array
    //        //this.sendInvoiceDraft(newInvoiceDraft); // Send
    //    }


    //    let t = 1;
    //    let combinedArrLength = 0;
    //    // Loop drafts and merge if same customer
    //    for (var r = 0; r < invoiceDrafts.length; r++)
    //    {
    //       combinedArrLength = readyinvoiceDrafts.length;

    //        for (t = 1; t < invoiceDrafts.length; t++)
    //        {
    //            if (invoiceDrafts[r].customer.customerNumber === invoiceDrafts[t].customer.customerNumber && r !== t) {
    //                invoiceDrafts[r].lines.push(invoiceDrafts[t].lines[0]); // Combine the drafts
    //                readyinvoiceDrafts.push(invoiceDrafts[r]); // Push comined Draft to readyDraftarray

    //                invoiceDrafts.splice(r, 1); // Remove item from array
    //                invoiceDrafts.splice(t-1, 1); // REmove item from array
    //            }
    //        }


    //            if (readyinvoiceDrafts.length === combinedArrLength)
    //            {
    //                readyinvoiceDrafts.push(invoiceDrafts[r]);
    //                invoiceDrafts.splice(r,1);
    //            }   
    //    }


    //     // Send all DraftInvoices 
    //    for (var g = 0; g < readyinvoiceDrafts.length; g++)
    //    {
    //        this.sendInvoiceDraft(readyinvoiceDrafts[g]); // Send
    //    }


    //}