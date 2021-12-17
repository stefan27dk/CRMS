import { FETCH_PRODUCTS, MESSAGE_TYPE } from './types';
import * as moment from 'moment';

//// Fetch Products
//export const fetchProducts = () => dispatch => {
//    fetch('api/Products/GetAllProducts')
//        .then(res => res.json())
//        .then(products => dispatch({
//            type: FETCH_PRODUCTS,
//            payload: products
//        })
//    );
//};








// Fetch Products
export const fetchProducts = () => dispatch => {
    fetch('api/Products/GetAllProducts')
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Customers --------------------------------
                    dispatch({
                        type: FETCH_PRODUCTS,
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
                        messageContent: "Fejl: Kunde kunne ikke Fetche Produkter!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};







// Add Product
export const addProduct = (product, blockSendActionButton, modalSetState) => dispatch => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    }

    // Fetch -------------------------------------------------------------
    fetch('api/Products/AddProduct', requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Products --------------------------------
                    dispatch({
                        type: FETCH_PRODUCTS,
                        payload: result
                    });


                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload:
                        {
                            messageType: 'success',
                            messageContent: `Produkt: ${product.name} er oprettet!`,
                            time: moment().add(3, 'seconds').valueOf()
                        }
                    });
                });

                modalSetState(false);
            }
            else // If Error ____________________________________________
            {
                // Dispatch - Error Message -----------------------------
                dispatch({
                    type: MESSAGE_TYPE,
                    payload:
                    {
                        messageType: 'error',
                        messageContent: `Fejl: Produkt: ${product.name} kunne ikke oprettes!!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
            blockSendActionButton.block = false;
        });
};












