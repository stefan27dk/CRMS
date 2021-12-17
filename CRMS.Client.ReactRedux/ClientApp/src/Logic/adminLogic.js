import { colorRed } from "../Definitions/commonDefinitions";



export const validateUserEditInput = (passInputId, emailInputId, phoneInputId) =>
{
    let success = true;
    let passInput = document.getElementById(passInputId);
    let emailInput = document.getElementById(emailInputId);
    let phoneInput = document.getElementById(phoneInputId);

    let emailRegex = new RegExp("^[a-z0-9]+(\.[a-z0-9]+)?@+[a-z0-9]+\.[a-z]{2,3}$");
  
    // Password
    if (passInput.value.length < 5)
    {
       success = false;
       passInput.style.backgroundColor = colorRed;
    }
    // Email
    if (!emailRegex.test(emailInput.value))
    {
        success = false;
        emailInput.style.backgroundColor = colorRed;
    }
    //Phone
    if (!(phoneInput.value.length < 9 && phoneInput.value.length > 7) && phoneInput.value != '')
    {
        success = false;
        phoneInput.style.backgroundColor = colorRed;
    }
    return success;
}





