
import * as moment from 'moment';
import { FETCH_INVOICE_DRAFTS, MESSAGE_TYPE } from './types';



//// Fetch Invoice - Drafts
//export const fetchInvoiceDrafts = () => dispatch => {
//    fetch('api/Invoices/GetAllFullInvoiceDrafts')
//        .then(res => res.json())
//        .then(result => dispatch({
//            type: FETCH_INVOICE_DRAFTS,
//            payload: result  
//        })
//        );
//};




// Fetch Invoice - Drafts
export const fetchInvoiceDrafts = () => dispatch => {
    fetch('api/Invoices/GetAllFullInvoiceDrafts')
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Customers --------------------------------
                    dispatch({
                        type: FETCH_INVOICE_DRAFTS,
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
                        messageContent: "Fejl: Kunde kunne ikke Fetche Fakturaer!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};

