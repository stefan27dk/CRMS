import * as moment from 'moment';
import { FETCH_PRODUCT, FETCH_PRODUCTS, FETCH_PRODUCT_GROUPS, MESSAGE_TYPE } from './types';



//// Fetch Product
//export const fetchProduct = (productId) => dispatch => {
//    fetch(`/api/Products/GetProductById?productId=${productId}`,)
//        .then(res => res.json())
//        .then(product => dispatch({
//            type: FETCH_PRODUCT, 
//            payload: product
//        })
//    );
//};






// Fetch Product
export const fetchProduct = (productId) => dispatch => {
    fetch(`/api/Products/GetProductById?productId=${productId}`)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Customers --------------------------------
                    dispatch({
                        type: FETCH_PRODUCT,
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
                        messageContent: `Fejl: Kunde kunne ikke Fetche Produkt med ID ${productId}!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};








// Dispatch Current Product 
export const dispatchCurrentProduct = (product) => dispatch => {
    dispatch({
        type: FETCH_PRODUCT,
        payload: product
    });
};











// Update Product
export const updateProduct = (product, productId, blockSendActionButton, modalSetState) => dispatch => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    }

    // Fetch -------------------------------------------------------------
    fetch(`api/Products/UpdateProduct?productId=${productId}`, requestOptions)
        .then((res) => {

            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Product  --------------------------------
                    dispatch({
                        type: FETCH_PRODUCT,
                        payload: result.product
                    });


                    // Dispatch - Products  --------------------------------
                    dispatch({
                        type: FETCH_PRODUCTS,
                        payload: result.products
                    });



                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload:
                        {
                            messageType: 'success',
                            messageContent: `Produkt: ${product.name} er opdateret!`,
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
                        messageContent: "Fejl: Produkt kunne ikke opdateres!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
            blockSendActionButton.block = false;
        });
};













//// Fetch Product Groups
//export const fetchProductGroups = () => dispatch => {
//    fetch('api/Products/GetAllProductGroups')
//        .then(res => res.json())
//        .then(productGroups => dispatch({
//            type: FETCH_PRODUCT_GROUPS,
//            payload: productGroups
//        })
//        );
//};





// Fetch Product Groups
export const fetchProductGroups = () => dispatch => {
    fetch('api/Products/GetAllProductGroups')
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Customers --------------------------------
                    dispatch({
                        type: FETCH_PRODUCT_GROUPS,
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
                        messageContent: "Fejl: Kunde kunne ikke Fetche Produkt Grupper!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};








// Delete Product
export const deleteProduct = (productId, history) => dispatch => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }

    // Fetch -------------------------------------------------------------
    fetch(`api/Products/DeleteProduct?productId=${productId}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Customer Domains --------------------------------
                    dispatch({
                        type: FETCH_PRODUCTS,
                        payload: result
                    });


                    history.push('/Products');

                    // Dispatch -Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload: {
                            messageType: 'success',
                            messageContent: `Produkt med ID: ${productId} er Sletet!`,
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
                        messageContent: `Fejl - Produkt med ID: ${productId} kunne ikke Slettes!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};
