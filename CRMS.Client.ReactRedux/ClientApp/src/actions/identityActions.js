import * as moment from "moment";
import { USER_STATE, LOG_IN, LOG_OUT, MESSAGE_TYPE, DELETE_USER_STATE } from "../actions/types";
import { dispatchAllToReduxStore } from "../Definitions/commonDefinitions";
import store from "../store";



export const logIn = (loginObj, history, originPath) => dispatch => {
    const requestOptions = {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    }

    fetch(`/api/Account/LogIn?email=${loginObj.email}&password=${loginObj.password}&rememberMe=${loginObj.rememberMe}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload: {
                            messageType: 'success',
                            messageContent: "Logged In!",
                            time: moment().add(3, 'seconds').valueOf()
                        }
                    });


                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: USER_STATE,
                        payload: result
                    });


                    history.push(originPath);
                    dispatchAllToReduxStore();


                    //console.log(originPath);
                    //res.json().then(result => {
                    //    return result;
                    //});
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
                        messageContent: "Fejl: Kunne Ikke logge ind!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};











export let loggedIn = async () => {
    let dispatch = store.dispatch;

    const requestOptions =
    {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }


    // Fetch -------------------------------------------------------------
    return fetch('/api/Account/IsLoggedIn', requestOptions)
        .then((res) => {
            return res.json().then(result => {
                // Dispatch - Success Message -------------------------
                dispatch({
                    type: USER_STATE,
                    payload: result
                });
                return result;
            });
        });
}








//export let getCurrentUserRoles = async () => {
//    const requestOptions =
//    {
//        method: 'GET',
//        mode: 'cors',
//        credentials: 'include',
//        headers: {
//            'Content-Type': 'application/json',
//            'Accept': 'application/json'
//        }
//    }


//    // Fetch -------------------------------------------------------------
//    const response = await fetch('/api/Account/GetCurrentUserRoles', requestOptions);
//    const json = await response.json();
//    return json;
//}










//export const getUserEmail = () => {
//    const requestOptions =
//    {
//        method: 'POST',
//        mode: 'cors',
//        credentials: 'include',
//        headers: {
//            'Content-Type': 'application/json',
//            'Accept': 'application/json'
//        }
//    }

//    // Fetch -------------------------------------------------------------
//    fetch('/api/Account/GetUserEmail', requestOptions)
//        .then((res) => {
//            //If Ok ______________________________________________________
//            if (res.ok) {
//                res.json().then(result => {
//                    return result;
//                });
//            }
//            else // If Error ____________________________________________
//            {
//                /*history.push('/LogIn');*/
//            }
//        });
//};









export const logOut = (history) => dispatch => {
    const requestOptions = {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    }

    fetch('/api/Account/LogOut', requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                // Dispatch - Success Message -------------------------
                dispatch({
                    type: MESSAGE_TYPE,
                    payload: {
                        messageType: 'success',
                        messageContent: "Logged Ud!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });

                dispatch({
                    type: DELETE_USER_STATE,
                    payload: {}
                });

                history.push('/LogIn');

            }
            else // If Error ____________________________________________
            {
                // Dispatch - Error Message -----------------------------
                dispatch({
                    type: MESSAGE_TYPE,
                    payload:
                    {
                        messageType: 'error',
                        messageContent: "Fejl: Kunne Ikke logge Ud!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};
