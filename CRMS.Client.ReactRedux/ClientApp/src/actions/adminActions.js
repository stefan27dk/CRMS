import { result } from 'lodash';
import * as moment from 'moment';
import { convertObjToUrlParams } from '../Definitions/commonDefinitions';
import { getUserFromUsersWithRoles } from '../Logic/usersLogic';
import { FETCH_ALL_NOTIFICATION_MAILS, FETCH_DB_CONNECTION_STRING, FETCH_ALL_ROLES, FETCH_USERS_WITH_ROLES, MESSAGE_TYPE } from './types';


//// Fetch Users
//export const fetchUsers = () => dispatch => {
//    fetch('api/Administrator/GetAllUsers')
//        .then(res => res.json())
//        .then(users => dispatch({
//            type: FETCH_USERS,
//            payload: users  
//        })
//    );
//};




//// Fetch UsersWithRoles
//export const fetchUsersWithRoles = () => dispatch => {
//    fetch('api/Administrator/GetAllUsersWithRoles')
//        .then(res => res.json())
//        .then(users => dispatch({
//            type: FETCH_USERS_WITH_ROLES,
//            payload: users
//        })
//        );
//};








// Fetch UsersWithRoles
export const fetchUsersWithRoles = () => dispatch => {
    fetch('api/Administrator/GetAllUsersWithRoles')
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Customers --------------------------------
                    dispatch({
                        type: FETCH_USERS_WITH_ROLES,
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
                        messageContent: "Fejl: Kunde kunne ikke Fetche Bruger med Roller!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};




//// Fetch all Roles
//export const fetchAllRoles = () => dispatch => {
//    fetch('api/Administrator/GetAllRoles')
//        .then(res => res.json())
//        .then(roles => dispatch({
//            type: FETCH_ALL_ROLES,
//            payload: roles
//        })
//        );
//};





// Fetch all Roles
export const fetchAllRoles = () => dispatch => {
    fetch('api/Administrator/GetAllRoles')
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch --- Result --------------------------------
                    dispatch({
                        type: FETCH_ALL_ROLES,
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
                        messageContent: "Fejl: Kunde kunne ikke Fetche Roller!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};






//// Fetch DB ConnectionString
//export const fetchDbConnectionstring = () => dispatch => {
//    fetch('api/Administrator/GetDbConString')
//        .then(res => res.json())
//        .then(result => dispatch({
//            type: FETCH_DB_CONNECTION_STRING,
//            payload: result
//        })
//        );
//};





// Fetch DB ConnectionString
export const fetchDbConnectionstring = () => dispatch => {
    fetch('api/Administrator/GetDbConString')
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch --- Result --------------------------------
                    dispatch({
                        type: FETCH_DB_CONNECTION_STRING,
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
                        messageContent: "Fejl: Kunde kunne ikke Fetche DB-Connectionstring!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};






//// Fetch all NotificationMails
//export const fetchAllNotificationMails = () => dispatch => {
//    fetch('api/NotificationMails/GetAllNotificationMails')
//        .then(res => res.json())
//        .then(result => dispatch({
//            type: FETCH_ALL_NOTIFICATION_MAILS,
//            payload: result
//        })
//        );      
//};






// Fetch all NotificationMails
export const fetchAllNotificationMails = () => dispatch => {
    fetch('api/NotificationMails/GetAllNotificationMails')
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch --- Result --------------------------------
                    dispatch({
                        type: FETCH_ALL_NOTIFICATION_MAILS,
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
                        messageContent: "Fejl: Kunde kunne ikke Fetche Notificering Mails!",
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
        });
};







// Delete Notification Mail
export const deleteNotificationMail = (email) => dispatch => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }

    // Fetch -------------------------------------------------------------
    fetch(`api/NotificationMails/DeleteNotificationMailByEmail?emailName=${email}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - UserRoles --------------------------------
                    dispatch({
                        type: FETCH_ALL_NOTIFICATION_MAILS,
                        payload: result
                    });




                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload:
                        {
                            messageType: 'success',
                            messageContent: `Email: ${email} blev slettet!`,
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
                        messageContent: `Email: ${email} kunne ikke slettes!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};











// Add Notification Mail
export const addNotificationMail = (email, emailToAddResetState, addMailButtonBlock) => dispatch => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 0, email: email }),
    }

    // Fetch -------------------------------------------------------------
    fetch('api/NotificationMails/AddNotificationMail', requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Mails --------------------------------
                    dispatch({
                        type: FETCH_ALL_NOTIFICATION_MAILS,
                        payload: result
                    });

                    emailToAddResetState();

                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload:
                        {
                            messageType: 'success',
                            messageContent: `Email: ${email} er oprettet!`,
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
                        messageContent: `Email: ${email} kunne ikke oprettes!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
            addMailButtonBlock.block = false;
        });
};


















export const updateConnectionString = (conString, resetStateconStringToUpdate) => dispatch => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    }


    // Fetch -------------------------------------------------------------
    fetch(`api/Administrator/SetDbConString?conString=${conString}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {

                    resetStateconStringToUpdate();
                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload:
                        {
                            messageType: 'success',
                            messageContent: `Connection String er opdateret!`,
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
                        messageContent: `Connection String kunne ikke opdateres!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};





















// Update User
export const updateUser = (userObj, updateUserButtonBlock, setModalState) => dispatch => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    }

    let obj = {};
    obj.firstName = userObj.firstName;
    obj.userId = userObj.userId;
    obj.email = userObj.email;
    obj.age = userObj.age;
    obj.phoneNumber = userObj.phoneNumber;
    obj.password = userObj.password;

    let urlParams = convertObjToUrlParams(obj);

    // Fetch -------------------------------------------------------------
    //fetch(`api/Administrator/UpdateUserById?userId=${userObj.id}&firstName=${userObj.firstName}&lastName=${userObj.lastName}&email=${userObj.email}&age=${userObj.age}&phoneNumber=${userObj.phoneNumber}&password=${userObj.password}`, requestOptions)
    fetch(`api/Administrator/UpdateUserById?${urlParams}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Customers --------------------------------
                    dispatch({
                        type: FETCH_USERS_WITH_ROLES,
                        payload: result
                    });

                    setModalState(false);

                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload:
                        {
                            messageType: 'success',
                            messageContent: `Bruger med email ${userObj.email} er opdateret!`,
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
                        messageContent: `Bruger med email ${userObj.email} kunne ikke opdateres!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }
            updateUserButtonBlock.block = false;
        });
};









// Register User
export const registerUser = (userObj, userToAddSetState, addUserButtonBlock, setModalState) => dispatch => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }

    let urlParams = convertObjToUrlParams(userObj);


    // Fetch -------------------------------------------------------------
    fetch(`api/Administrator/RegisterUser?${urlParams}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Users --------------------------------
                    dispatch({
                        type: FETCH_USERS_WITH_ROLES,
                        payload: result
                    });

                    userToAddSetState();
                    setModalState(false);
                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload:
                        {
                            messageType: 'success',
                            messageContent: `Bruger med email ${userObj.email} er oprettet!`,
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
                        messageContent: `Bruger med email ${userObj.email} kunne ikke oprettes!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

            addUserButtonBlock.block = false;
        });
};

















export const addUserToRole = (userEmail, roleName, setStateOfAddRoleDropDown, selectedUser, setSelectedUserState) => dispatch => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    }

    //let rolesDropDown = document.getElementById(dropDownId);
    //let dropdownOption = rolesDropDown.options[rolesDropDown.selectedIndex];
    //let roleName = dropdownOption.text;


    // Fetch -------------------------------------------------------------
    fetch(`api/Administrator/AddUserToRole?userEmail=${userEmail}&roleName=${roleName}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Customers --------------------------------
                    dispatch({
                        type: FETCH_USERS_WITH_ROLES,
                        payload: result
                    });


                    let userToUpdate = getUserFromUsersWithRoles(selectedUser.userId, result);
                    setSelectedUserState(userToUpdate[0]);
                    setStateOfAddRoleDropDown();

                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload:
                        {
                            messageType: 'success',
                            messageContent: `Role ${roleName} er tilføjet til ${userEmail}!`,
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
                        messageContent: `Role ${roleName} kunne ikke tilføjes til ${userEmail}!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};














// Delete User Role
export const deleteUserRole = (userEmail, roleName, setSelectedUserState, selectedUser, setStateOfAddRoleDropDown, addRoleDropDown) => dispatch => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }

    // Fetch -------------------------------------------------------------
    fetch(`api/Administrator/RemoveUserFromRole?email=${userEmail}&roleName=${roleName}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - UserRoles --------------------------------
                    dispatch({
                        type: FETCH_USERS_WITH_ROLES,
                        payload: result
                    });

                    let userToUpdate = getUserFromUsersWithRoles(selectedUser.userId, result);
                    setSelectedUserState(userToUpdate[0]);
                    console.log(userToUpdate[0]);
                    setStateOfAddRoleDropDown();
                    addRoleDropDown.current.selectedIndex = 0;



                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload:
                        {
                            messageType: 'success',
                            messageContent: `Role med navn ${roleName} er sletet fra bruger med email ${userEmail}!`,
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
                        messageContent: `Role med navn ${roleName} kunne ikke sletes fra bruger med email ${userEmail}!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};






// Delete User 
export const deleteUser = (userEmail) => dispatch => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }

    // Fetch -------------------------------------------------------------
    fetch(`api/Administrator/DeleteUser?email=${userEmail}`, requestOptions)
        .then((res) => {
            //If Ok ______________________________________________________
            if (res.ok) {
                res.json().then(result => {
                    // Dispatch - Users with roles --------------------------------
                    dispatch({
                        type: FETCH_USERS_WITH_ROLES,
                        payload: result
                    });



                    // Dispatch - Success Message -------------------------
                    dispatch({
                        type: MESSAGE_TYPE,
                        payload:
                        {
                            messageType: 'success',
                            messageContent: `Bruger med email ${userEmail} er sletet!`,
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
                        messageContent: `Bruger med email ${userEmail} kunne ikke sletes!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                });
            }

        });
};

