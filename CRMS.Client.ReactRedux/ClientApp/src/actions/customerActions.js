import * as moment from 'moment';
import { FETCH_CUSTOMER, FETCH_CUSTOMERS, FETCH_CUSTOMER_CONTACTPERSONS, FETCH_CUSTOMER_SUBSCRIPTIONS, FETCH_SUBSCRIPTIONS, MESSAGE_TYPE } from './types';



//// Fetch Cutomer
//export const fetchCustomer = (customerId) => dispatch => {
//    fetch(`/api/Customers/${customerId}`,)
//        .then(res => res.json())
//        .then(customer => dispatch({
//            type: FETCH_CUSTOMER,
//            payload: customer
//        })
//    );
//};







//// Fetch Cutomer - Contact Persons
//export const fetchCustomerContactPersons = (customerId) => dispatch => {
//    fetch(`/api/Customers/GetCustomerContactPersons?customerId=${customerId}`,)
//        .then(res => res.json())
//        .then(customerContactPersons => dispatch({
//            type: FETCH_CUSTOMER_CONTACTPERSONS,
//            payload: customerContactPersons
//        })
//        );
//};






// Fetch Cutomer - Contact Persons
export const fetchCustomerContactPersons = (customerId) => dispatch => {
    fetch(`/api/Customers/GetCustomerContactPersons?customerId=${customerId}`)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch --- Result --------------------------------
                    dispatch({
                        type: FETCH_CUSTOMER_CONTACTPERSONS,
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
                        messageContent: "Fejl: Kunde kunne ikke Fetche Kontaktpersoner!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};






// DELETE -  Cutomer Contact Person 
export const deleteCustomerContactPerson = (customerId, contactPersonId) => dispatch => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }

    // Fetch -------------------------------------------------------------
    fetch(`/api/Customers/DeleteContactPerson?customerId=${customerId}&contactId=${contactPersonId}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch -  Cutomer Contact Persons --------------------------------
                    dispatch({
                        type: FETCH_CUSTOMER_CONTACTPERSONS,
                        payload: result
                    });

                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload: {
                            messageType: 'success',
                            messageContent: "Kontaktperson slettet!",
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
                        messageContent: "Fejl: Kontaktperson kunne ikke slettes!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};













// UPDATE -  Cutomer Contact Persons 
export const updateCustomerContactPersons = (customerId, contactPersonObject, blockUpdateContactPersonButton, setModalState) => dispatch => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactPersonObject),

    }

    // Fetch -------------------------------------------------------------
    fetch(`/api/Customers/UpdateContactPerson?customerId=${customerId}&contactId=${contactPersonObject.customerContactNumber}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch -  Cutomer Contact Persons --------------------------------
                    dispatch({
                        type: FETCH_CUSTOMER_CONTACTPERSONS,
                        payload: result
                    });

                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload: {
                            messageType: 'success',
                            messageContent: "Kontaktperson Opdateret!",
                            time: moment().add(3, 'seconds').valueOf()
                        }
                    });
                });

                setModalState(false);
            }
            else // If Error ____________________________________________
            {
                // Dispatch - Error Message -----------------------------
                dispatch({
                    type: MESSAGE_TYPE,
                    payload:
                    {
                        messageType: 'error',
                        messageContent: "Fejl: Kontaktperson kunne ikke opdateres!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

            blockUpdateContactPersonButton.block = false;
        });
};










// Add -  Cutomer Contact Person 
export const addCustomerContactPerson = (customerId, contactPersonObject, blockAddContactPersonButton, setModalState) => dispatch => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactPersonObject),

    }

    // Fetch -------------------------------------------------------------
    fetch(`/api/Customers/CreateContactPerson?customerId=${customerId}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch -  Cutomer Contact Persons --------------------------------
                    dispatch({
                        type: FETCH_CUSTOMER_CONTACTPERSONS,
                        payload: result
                    });

                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload: {
                            messageType: 'success',
                            messageContent: "Kontaktperson Oprettet!",
                            time: moment().add(3, 'seconds').valueOf()
                        }
                    });
                });

                setModalState(false);
            }
            else // If Error ____________________________________________
            {
                // Dispatch - Error Message -----------------------------
                dispatch({
                    type: MESSAGE_TYPE,
                    payload:
                    {
                        messageType: 'error',
                        messageContent: "Fejl: Kontaktperson kunne ikke oprettes!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

            blockAddContactPersonButton.block = false;
        });
};















// Add -  Cutomer Subscription
export const addCustomerSubscription = (subscription) => dispatch => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),

    }

    // Fetch -------------------------------------------------------------
    fetch('/api/Subscriptions/AddSubscription', requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch -  Cutomer Contact Persons --------------------------------


                    // Fetch Subscriptions
                    dispatch({
                        type: FETCH_SUBSCRIPTIONS,
                        payload: result
                    });

                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload: {
                            messageType: 'success',
                            messageContent: "Abonnement er tilføjet!",
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
                        messageContent: "Fejl: Abonnement kunne ikke tiføjes!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};








// Update Customer
export const updateCustomer = (customer, customerId, blockEditCustomerButton, setStateEditCustomerModal) => dispatch => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
    }

    // Fetch -------------------------------------------------------------
    fetch(`api/Customers/UpdateCustomer?customerId=${customerId}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Csutomer --------------------------------
                    dispatch({
                        type: FETCH_CUSTOMER,
                        payload: result.customer
                    });


                    dispatch({
                        type: FETCH_CUSTOMERS,
                        payload: result.customers
                    });

                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload:
                        {
                            messageType: 'success',
                            messageContent: "Kunde opdateret!",
                            time: moment().add(3, 'seconds').valueOf()
                        }
                    });

                    setStateEditCustomerModal(false);
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
                        messageContent: "Fejl: Kunde kunne ikke opdateres!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
            blockEditCustomerButton.block = false; // Reset Block - Allow to click on button
        });
};












// Delete Customer
export const deleteCustomer = (customerId, history) => dispatch => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }

    // Fetch -------------------------------------------------------------
    fetch(`api/Customers/DeleteCustomer?customerId=${customerId}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Customer Domains --------------------------------
                    dispatch({
                        type: FETCH_CUSTOMERS,
                        payload: result
                    });


                    history.push('/Customers');

                    // Dispatch -Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload: {
                            messageType: 'success',
                            messageContent: `Kunde med ID: ${customerId} er Sletet!`,
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
                        messageContent: `Fejl - Kunde med ID: ${customerId} kunne ikke Slettes!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};





