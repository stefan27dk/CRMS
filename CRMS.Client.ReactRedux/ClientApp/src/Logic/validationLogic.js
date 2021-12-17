import { trim } from "lodash";

export const OnlyNumber = event => {
    if (!(event.keycode == 8 || event.keycode == 46) && (event.keycode < 48 || event.keycode > 57)) // 8 = backspace & 46 = DEL  || 48-57 = numbers
    {
        event.preventDefault();
    }
};






// ===================== Allow - Only Numbers ===============================================================
export const onlyNumbers = (event) => {
    var keycode = (event.which) ? event.which : event.keyCode;


    if (event.shiftKey && (keycode > 34 && keycode < 44)) // Disable SHIFT
    {
        return true;
    }
    else if (event.shiftKey) {
        event.preventDefault();
    }
    else if (event.ctrlKey && event.altKey) // Disable CTRL + ALT
    {
        event.preventDefault();
    }
    else if (event.ctrlKey && keycode == 65) // CTRL + A
    {
        return true;
    }
    else if (event.ctrlKey && keycode == 67) // CTRL + C
    {
        return true;
    }
    else if (event.ctrlKey && keycode == 86) // CTRL + V
    {
        return true;
    }
    else if (keycode > 105) // All others not numbers
    {
        event.preventDefault();
    }
    else if ((keycode > 7 && keycode < 16) || (keycode > 34 && keycode < 65) || (keycode > 92 && keycode < 106)) // 8 = backspace & 46 = DEL  || 48-57 = numbers
    {
        return true;
    }
    else {
        event.preventDefault();
    }
}












// ===================== Allow - Only Letters and Space ===============================================================

export const onlyLettersAndSpace = (event) => {
    var keycode = (event.which) ? event.which : event.keyCode;


    if ((keycode > 7 && keycode < 16) || keycode == 32 || (keycode > 34 && keycode < 48) || (keycode > 64 && keycode < 91)) {
        return true;
    }
    else {
        event.preventDefault();
    }

}







// ===================== Allow - Only Letters===============================================================

export const onlyLetters = (event) => {
    var keycode = (event.which) ? event.which : event.keyCode;


    if ((keycode > 7 && keycode < 16) || (keycode > 34 && keycode < 48) || (keycode > 64 && keycode < 91)) {
        return true;
    }
    else {
        event.preventDefault();
    }

}








// ===================== Allow - Only Numbers  and Comma ===============================================================
export const onlyNumbersAndComma = (event) => {

    if (event.charCode >= 32 && event.charCode <= 57) {
        if (event.charCode == 44) {
            console.log(event.target);
            event.target.value += '.';
            event.preventDefault();
        }
        return true;
    }
    else {
        event.preventDefault();
    }
}







// ===================== No Letters ===============================================================
export const noLetters = (event) => {
    var keycode = (event.which) ? event.which : event.keyCode;


    if ((keycode > 34 && keycode < 48) || (keycode > 64 && keycode < 91)) {
        event.preventDefault();
    }
    else {
        return true;
    }

}








// Is String ============================================================================================================= 
export const isString = (value) => {
    if (value && value.trim() !== '') {
        let isInt = +value;
        if (isNaN(isInt)) {
            return true;
        }
        else {
            return false;
        }
    }
}






// Try Convert to INT else return default ============================================================================================================= 
export const tryConvertToInt = (value) => {
    if (value && value.trim() !== '') {
        let isInt = +value;
        if (isNaN(isInt)) {
            return value;
        }
        else {
            return isInt;
        }
    }
}











export const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
}



export const validateDomain = (domain) => {
    return /^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/.test(domain);
}







