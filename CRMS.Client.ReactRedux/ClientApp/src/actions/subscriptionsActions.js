import * as moment from 'moment';
import { renewSubscriptions, sendUpdatedSubscriptions } from '../Logic/subscriptionsLogic';
import store from '../store';
import { FETCH_SUBSCRIPTIONS, MESSAGE_TYPE } from './types';
//import { UPDATE_SUBSCRIPTIONS} from './types';
//import { fetchCustomers } from './customersActions';
//import Customers from '../components/Customers';


//// Fetch Subscriptions
//export const fetchSubscriptions = () => dispatch => {
//    fetch('api/Subscriptions/GetAllSubscriptions')
//        .then(res => res.json())
//        .then(subscriptions => dispatch({
//            type: FETCH_SUBSCRIPTIONS,
//            payload: subscriptions
//        })
//    );
//};







// Fetch Subscriptions
export const fetchSubscriptions = () => dispatch => {
    fetch('api/Subscriptions/GetAllSubscriptions')
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Customers --------------------------------
                    dispatch({
                        type: FETCH_SUBSCRIPTIONS,
                        payload: result
                    })
                });
            }
            else // If Error ____________________________________________
            {
                // Dispatch - Error Message -----------------------------
                dispatch({
                    type: MESSAGE_TYPE,
                    payload:
                    {
                        messageType: 'error',
                        messageContent: "Fejl: Kunde kunne ikke Fetche Abonnementer!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};








// DELETE - Subscription By ID
export const deleteSubscription = (subscriptionId) => dispatch => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },

    }

    // Fetch -------------------------------------------------------------
    fetch(`/api/Subscriptions/DeleteSubscriptionByID?subscriptionId=${subscriptionId}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch -  SUBSCRIPTIONS --------------------------------
                    dispatch({
                        type: FETCH_SUBSCRIPTIONS,
                        payload: result
                    });

                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload: {
                            messageType: 'success',
                            messageContent: `Abonnement med ID:${subscriptionId} er slettet!`,
                            time: moment().add(3, 'seconds').valueOf()
                        }
                    });
                });
            }
            else // If Error ____________________________________________
            {
                // Dispatch - Error Message -----------------------------
                dispatch({
                    type: MESSAGE_TYPE,
                    payload:
                    {
                        messageType: 'error',
                        messageContent: `Fejl: Abonnement med ID:${subscriptionId} kunne ikke slettes!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};













// UPDATE - Subscription
export const updateSubscription = (subscription, updateSubscriptionButtonBlock, setStateEditSubscriptionModalIsOpen) => dispatch => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
    }

    // Fetch -------------------------------------------------------------
    fetch('api/Subscriptions/UpdateSubscription', requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - SUBSCRIPTIONS --------------------------------
                    dispatch({
                        type: FETCH_SUBSCRIPTIONS,
                        payload: result
                    });

                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload: {
                            messageType: 'success',
                            messageContent: `Abonnement med ID: ${subscription.id} er opdateret!`,
                            time: moment().add(3, 'seconds').valueOf()
                        }
                    });
                });

                setStateEditSubscriptionModalIsOpen(false);
            }
            else // If Error ____________________________________________
            {
                // Dispatch - Error Message -----------------------------
                dispatch({
                    type: MESSAGE_TYPE,
                    payload:
                    {
                        messageType: 'error',
                        messageContent: `Fejl: Abonnement med ID: ${subscription.id} kunne ikke opdateres!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
            updateSubscriptionButtonBlock.block = false;
        });
};











