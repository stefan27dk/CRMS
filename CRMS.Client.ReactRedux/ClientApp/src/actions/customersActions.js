import * as moment from 'moment';
import { FETCH_CUSTOMERS, FETCH_CVR_API_ADDRESS, MESSAGE_TYPE } from './types';


//// Fetch Cutomers
//export const fetchCustomers = () => dispatch => {
//    fetch('api/Customers/GetAllCustomersWithDomains')
//        .then(res => res.json())
//        .then(customers => dispatch({
//            type: FETCH_CUSTOMERS,
//            payload: customers // Get Customers with status + add green subscriptions to an array
//        })
//    );
//};









// Fetch Cutomers
export const fetchCustomers = () => dispatch => {
    fetch('api/Customers/GetAllCustomersWithDomains')
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch --- Result --------------------------------
                    dispatch({
                        type: FETCH_CUSTOMERS,
                        payload: result // Get Customers with status + add green subscriptions to an array
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
                        messageContent: "Fejl: Kunde kunne ikke Fetche Kunder med domæner!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};








// Fetch CVR API Address
export const fetchCvrApiAddress = () => dispatch => {
    console.log("CVR Address");
    fetch('api/Customers/GetCvrApiAddress')
        .then((res) => {

            //If Ok ______________________________________________________
            if (res.ok) {

                console.log("OK");
                res.json().then(result => {
                    // Dispatch - Customers --------------------------------
                    dispatch({
                        type: FETCH_CVR_API_ADDRESS,
                        payload: result
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
                        messageContent: "Fejl: Kunde kunne ikke Fetche Cvr API Adresse!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};






//Fetch Data from CVR API 
export const fetchDataFromCvrApi = (cvrApiAddressWithCvr, callbackFunc) => dispatch => {
    fetch(cvrApiAddressWithCvr)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    callbackFunc(result);
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
                        messageContent: `Fejl: Kunne ikke Fetche Kunde data fra Cvr API Adresse! - ${cvrApiAddressWithCvr}`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};










// Add Customer
export const addCustomer = (customer, setStateOpenAddCustomerModal, blockAddCustomerButton) => dispatch => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
    }


    // Fetch -------------------------------------------------------------
    fetch('api/Customers/AddCustomer', requestOptions)
        .then((res) => {
            blockAddCustomerButton.block = false;
            //If Ok ______________________________________________________
            if (res.ok) {

                setStateOpenAddCustomerModal(false);
                res.json().then(result => {
                    // Dispatch - Customers --------------------------------
                    dispatch({
                        type: FETCH_CUSTOMERS,
                        payload: result
                    });


                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload:
                        {
                            messageType: 'success',
                            messageContent: "Ny kunde er oprettet!",
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
                        messageContent: "Fejl: Kunde kunne ikke oprettes!!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};

