////////import * as moment from "moment";
////import { MESSAGE_TYPE } from "../actions/types";
////import { dispatchAllToReduxStore, setIsUserLoggedIn } from "../Definitions/commonDefinitions";



////export const logIn = (loginObj, history, originPath) => dispatch => {
////    const requestOptions = {
////        method: 'POST',
////        mode: 'cors',
////        credentials: 'include',
////        headers: { 'Content-Type': 'application/json' }
////    }

////    let result = fetch(`/api/Account/LogIn?email=${loginObj.email}&password=${loginObj.password}&rememberMe=${loginObj.rememberMe}`, requestOptions)
////        .then((res) => {
////            //If Ok ______________________________________________________
////            if (res.ok) {
////                // Dispatch - Success Message -------------------------
////                dispatch({
////                    type: MESSAGE_TYPE,
////                    payload: {
////                        messageType: 'success',
////                        messageContent: "Logged In!",
////                        time: moment().add(3, 'seconds').valueOf()
////                    }
////                });

////                setIsUserLoggedIn(true);
////                history.push(originPath);
////                dispatchAllToReduxStore();


////                //console.log(originPath);
////                //res.json().then(result => {
////                //    return result;
////                //});
////            }
////            else // If Error ____________________________________________
////            {
////                // Dispatch - Error Message -----------------------------
////                dispatch({
////                    type: MESSAGE_TYPE,
////                    payload:
////                    {
////                        messageType: 'error',
////                        messageContent: "Fejl: Kunne Ikke logge ind!",
////                        time: moment().add(3, 'seconds').valueOf()
////                    }
////                });
////            }
////            return res.json()
////        });
////    return result;
////};











////export let loggedIn = async () => {
////    const requestOptions =
////    {
////        method: 'GET',
////        mode: 'cors',
////        credentials: 'include',
////        headers: {
////            'Content-Type': 'application/json',
////            'Accept': 'application/json'
////        }
////    }


////    // Fetch -------------------------------------------------------------
////    const response = await fetch('/api/Account/IsLoggedIn', requestOptions);
////    const json = await response.json();
////    return json;
////}








////export let getCurrentUserRoles = async () => {
////    const requestOptions =
////    {
////        method: 'GET',
////        mode: 'cors',
////        credentials: 'include',
////        headers: {
////            'Content-Type': 'application/json',
////            'Accept': 'application/json'
////        }
////    }


////    // Fetch -------------------------------------------------------------
////    const response = await fetch('/api/Account/GetCurrentUserRoles', requestOptions);
////    const json = await response.json();
////    return json;
////}










////export const getUserEmail = () => {
////    const requestOptions =
////    {
////        method: 'POST',
////        mode: 'cors',
////        credentials: 'include',
////        headers: {
////            'Content-Type': 'application/json',
////            'Accept': 'application/json'
////        }
////    }

////    // Fetch -------------------------------------------------------------
////    fetch('/api/Account/GetUserEmail', requestOptions)
////        .then((res) => {
////            //If Ok ______________________________________________________
////            if (res.ok) {
////                res.json().then(result => {
////                    return result;
////                });
////            }
////            else // If Error ____________________________________________
////            {
////                /*history.push('/LogIn');*/
////            }
////        });
////};









////export const logOut = (history) => dispatch => {
////    const requestOptions = {
////        method: 'POST',
////        mode: 'cors',
////        credentials: 'include',
////        headers: { 'Content-Type': 'application/json' }
////    }

////    let result = fetch('/api/Account/LogOut', requestOptions)
////        .then((res) => {
////            //If Ok ______________________________________________________
////            if (res.ok) {
////                // Dispatch - Success Message -------------------------
////                dispatch({
////                    type: MESSAGE_TYPE,
////                    payload: {
////                        messageType: 'success',
////                        messageContent: "Logged Ud!",
////                        time: moment().add(3, 'seconds').valueOf()
////                    }
////                });

////                setIsUserLoggedIn(false);
////                history.push('/LogIn');


////                //console.log(originPath);
////                //res.json().then(result => {
////                //    return result;
////                //});
////            }
////            else // If Error ____________________________________________
////            {
////                // Dispatch - Error Message -----------------------------
////                dispatch({
////                    type: MESSAGE_TYPE,
////                    payload:
////                    {
////                        messageType: 'error',
////                        messageContent: "Fejl: Kunne Ikke logge Ud!",
////                        time: moment().add(3, 'seconds').valueOf()
////                    }
////                });
////            }
////            return res.json()
////        });
////    return result;
////};
