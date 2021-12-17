import React from 'react';
import { colorRed, colorWhite } from '../Definitions/commonDefinitions';
import { isString, validateEmail } from './validationLogic';



export const getUserFromUsersWithRoles = (userId, usersWithRoles) => {
    return usersWithRoles.filter(r => r.userId == userId);
}





export const getUserRolesAsHtml = (user) => {
    if (user.roles !== undefined) {
        return (<>
            {
                user.roles.map((role) => {
                    return <p key={role.roleId} className="my-0">{role.roleName}</p>;
                })
            }
        </>);
    }
    else {
        return 'Ingen';
    }
}








export const getUnassaignedRolesForUser = (allRoles, userRoles) => {
    // If No User Roles
    if (userRoles == undefined || userRoles.length == 0 || userRoles[0].roleName == "") {
        return allRoles;
    }
    else if (allRoles.length == userRoles.length || allRoles[0] == undefined) {
        return [];
    }



    let clonedAllRoles = [...allRoles];
    let clonedUserRoles = [...userRoles];


    for (let t = 0; t < clonedAllRoles.length; t++) {
        for (let w = 0; w < clonedUserRoles.length; w++) {
            if (clonedAllRoles[t].name == clonedUserRoles[w].roleName) {
                clonedAllRoles.splice(t, 1);
                clonedUserRoles.splice(w, 1);
                w = w - 1;
            }
        }
        if (clonedUserRoles.length == 0) {
            break;
        }
    }

    return clonedAllRoles;
}








export const validateUser = (currentForm) => {
    let validated = true;
    let elements = currentForm.current.elements;

    // Name
    if (elements.firstName.value == undefined || elements.firstName.value == '' || elements.firstName.value.length < 2 || isString(elements.firstName.value) == false) {
        elements.firstName.style.backgroundColor = colorRed;
        elements.firstName.classList.add('is-invalid');
        validated = false;
    }
    else {
        elements.firstName.style.backgroundColor = colorWhite;
        elements.firstName.classList.remove('is-invalid');
        elements.firstName.classList.add('is-valid');
    }
    // Email
    if (elements.email.value == undefined || elements.email.value == '' || validateEmail(elements.email.value) == false) {
        elements.email.style.backgroundColor = colorRed;
        elements.email.classList.add('is-invalid');
        validated = false;
    }
    else {
        elements.email.style.backgroundColor = colorWhite;
        elements.email.classList.remove('is-invalid');
        elements.email.classList.add('is-valid');
    }
    // Password
    if (elements.password.value == undefined || elements.password.value == '' || elements.password.value.length < 6) {
        elements.password.style.backgroundColor = colorRed;
        elements.password.classList.add('is-invalid');
        validated = false;
    }
    else {
        elements.password.style.backgroundColor = colorWhite;
        elements.password.classList.remove('is-invalid');
        elements.password.classList.add('is-valid');
    }
    // Phone
    if (elements.phoneNumber.value != '') {
        if (elements.phoneNumber.value == undefined || elements.phoneNumber.value.length < 8) {
            elements.phoneNumber.style.backgroundColor = colorRed;
            elements.phoneNumber.classList.add('is-invalid');
            validated = false;
        }
        else {
            elements.phoneNumber.style.backgroundColor = colorWhite;
            elements.phoneNumber.classList.remove('is-invalid');
            elements.phoneNumber.classList.add('is-valid');
        }
    }
    else {
        elements.phoneNumber.style.backgroundColor = colorWhite;
        elements.phoneNumber.classList.remove('is-invalid');
        elements.phoneNumber.classList.add('is-valid');
    }
    return validated;
}





//export const getUnassaignedRolesForUser = (allRoles, userRoles) => {
//    let cloneAllRoles = [...allRoles];
//    let cloneUserRoles = [...userRoles];

//    let aviableRoles = allRoles.map((role) => {
//        userRoles.map((userRole) => {
//            if (userRole.roleName == role.name) {
//                role.
//            }
//        });
//    });
//}