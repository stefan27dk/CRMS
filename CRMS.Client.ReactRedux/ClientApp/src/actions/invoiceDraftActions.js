import { createInvoiceDrafts, groupSubscriptionsByCustomer } from '../Logic/invoicesLogic';
import { getSubscriptionsForInvoicement } from '../Logic/subscriptionsLogic';
import store from '../store';
import { MESSAGE_TYPE, UPDATE_SUBSCRIPTIONS } from './types';
import moment from 'moment';





// Send InvoiceDraft
export const createAndSendInvoiceDrafts = (isWorking) => dispatch => {
    const { customers, subscriptions } = store.getState();
    const { list: subscriptionList } = subscriptions;
    let subscriptionsForInvoicment = getSubscriptionsForInvoicement(subscriptionList);  // Get Subscritpions for Invoicement


    // Send Drafts -------------------------------------------------------------------------------------------------------------------------
    if (subscriptionsForInvoicment.length !== 0) {

        // Loading Message 
        dispatch({
            type: MESSAGE_TYPE,
            payload: {
                messageType: 'loading',
                messageContent: "Sender Faktura/er - Vent venligst",
                time: moment().add(3, 'seconds').valueOf()
            }
        });


        // Create Drafts
        let groupedSubscriptions = groupSubscriptionsByCustomer(subscriptionsForInvoicment); // Get Sorted/Grouped Subscriptions for invoicement
        let readyInvoiceDrafts = createInvoiceDrafts(customers, groupedSubscriptions); // Create InvoiceDrafts - returns array

        // Request Options
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(readyInvoiceDrafts)
        };


        // Fetch
        fetch('api/Invoices/CreateDrafts', requestOptions)
            .then((res) => {
                //If Ok
                if (res.ok) {
                    res.json().then(result => {

                        //Dispatch - Update Subscriptions
                        dispatch({
                            type: UPDATE_SUBSCRIPTIONS,
                            payload: result
                        });

                        // Dispatch - Success Message 
                        dispatch({
                            type: MESSAGE_TYPE,
                            payload: {
                                messageType: 'success',
                                messageContent: "Faktura/er er Sendt!",
                                time: moment().add(3, 'seconds').valueOf()
                            }
                        });
                    });

                }
                else // If Error  
                {
                    // Dispatch - Error Message 
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload: {
                            messageType: 'error',
                            messageContent: "Fejl: Faktura/er er ikke sendt!",
                            time: moment().add(3, 'seconds').valueOf()
                        }
                    });
                }

                isWorking.working = false;
            });
    }
    else // If no active subscriptions
    {
        // Warning Message 
        dispatch({

            type: MESSAGE_TYPE,
            payload: {
                messageType: 'warning',
                messageContent: "Der er ikke faktura/er der skal sendes",
                time: moment().add(3, 'seconds').valueOf()
            }

        });

        isWorking.working = false;
    }


};


