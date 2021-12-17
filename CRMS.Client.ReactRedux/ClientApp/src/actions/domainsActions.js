import { FETCH_CUSTOMER_DOMAINS, FETCH_ALL_DOMAINS, MESSAGE_TYPE, UPDATE_CUSTOMER_DOMAIN, ADD_CUSTOMER_DOMAIN, DELETE_CUSTOMER_DOMAIN } from './types';
import moment from 'moment';


//// Fetch Cutomer Domains
//export const fetchCustomerDomains = (customerId) => dispatch => {
//    fetch(`api/Domains/${customerId}`,)
//        .then(res => res.json())
//        .then(customerDomains => dispatch({
//            type: FETCH_CUSTOMER_DOMAINS,
//            payload: customerDomains
//        })
//    );
//};







//// Fetch All Domains
//export const fetchAllDomains = () => dispatch => {
//    fetch('api/Domains/GetAllCustomersDomains')
//        .then(res => res.json())
//        .then(allDomains => dispatch({
//            type: FETCH_ALL_DOMAINS,
//            payload: allDomains
//        })
//        );
//};










// Fetch All Domains
export const fetchAllDomains = () => dispatch => {
    fetch('api/Domains/GetAllCustomersDomains')
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Customers --------------------------------
                    dispatch({
                        type: FETCH_ALL_DOMAINS,
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
                        messageContent: "Fejl: Kunde kunne ikke Fetche Alle Domæner!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};









// Add Domain - EX: Array Pattern -  [{"id": 0, "customerId": 0, "domain": "string"}]
export const addDomain = (domain, newDomainSetState) => dispatch => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(domain),
    }

    // Fetch -------------------------------------------------------------
    fetch(`api/Domains/AddDomain`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {

                    // Dispatch - Update Domain --------------------------------
                    dispatch({
                        type: ADD_CUSTOMER_DOMAIN,
                        payload: result
                    });



                    //// Dispatch - All Domains --------------------------------
                    //dispatch({
                    //    type: FETCH_ALL_DOMAINS,
                    //    payload: result.allDomains
                    //});


                    // Dispatch -Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload: {
                            messageType: 'success',
                            messageContent: "Domæne Tilføjet!",
                            time: moment().add(3, 'seconds').valueOf()
                        }
                    });

                    newDomainSetState();
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
                        messageContent: "Fejl: Domæne kunne ikke tilføjes!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};











// UPDATE -  Cutomer Contact Persons 
export const updateDomain = (domain, setStateEditable) => dispatch => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(domain),

    }

    // Fetch -------------------------------------------------------------
    fetch('/api/Domains/UpdateDomain', requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {


                    // Dispatch -  Domains  --------------------------------
                    dispatch({
                        type: UPDATE_CUSTOMER_DOMAIN,
                        payload: domain
                    });



                    setStateEditable();


                    // Dispatch -  Domains  --------------------------------
                    dispatch({
                        type: FETCH_ALL_DOMAINS,
                        payload: result
                    });



                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload: {
                            messageType: 'success',
                            messageContent: "Domæne Opdateret!",
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
                        messageContent: "Fejl: Kunne ikke opdatere Domæne!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};










// Delete Cutomer Domain
export const deleteDomain = (domain, foreUpdate) => dispatch => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }

    // Fetch -------------------------------------------------------------
    fetch(`api/Domains/DeleteDomainByName?domainName=${domain.domainName}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Customer Domains --------------------------------
                    dispatch({
                        type: DELETE_CUSTOMER_DOMAIN,
                        payload: domain
                    });



                    // Dispatch - All Domains --------------------------------
                    dispatch({
                        type: FETCH_ALL_DOMAINS,
                        payload: result
                    });

                    foreUpdate();

                    // Dispatch -Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload: {
                            messageType: 'success',
                            messageContent: "Domæne Sletet!",
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
                        messageContent: "Fejl - kan ikke slette domæne",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};



