import _ from 'lodash';
import { colorRed, colorWhite } from '../Definitions/commonDefinitions';
import { validateDomain, validateEmail } from './validationLogic';
   

// Status ===================================================================================================================================
export  const getCustomersWithStatus = (customers, subscriptions) =>
{     
    let customersList = customers; // Customers List

    // Customers Loop
    for (var i = 0; i < customersList.length; i++)
    {
        customersList[i].status = "";
        // Subscriptions loop
        for (var e = 0; e < subscriptions.length; e++)
        {      
            if (subscriptions[e].customerId === customersList[i].customerNumber && customersList[i].status !== "green")
            {
                customersList[i].status = calculateStatus(subscriptions[e].periodEndDate); // Calc status
            }
            else if (customersList[i].status !== "green" && customersList[i].status !== "white")  // If its not green or white than red
            {
                customersList[i].status = "red"; // There are no active subscriptions
            }
        }
    }
    return customersList;
}






// Calculate Status ========================================================================================================================
const calculateStatus = (periodEndDate) =>
{
    // Subscription date
    const subscriptionEndDate = periodEndDate.substring(0, 10);


    // Today
    const today = new Date().toISOString().slice(0, 10);

    if (today === subscriptionEndDate)  // If subscription ends today
    {
        return "green"; // Ready to be invoiced
    }
    else
    {
        return "white"; // There are subscriptions and all are up to date
    }

}






// Top Customers ========================================================================================================================
export const calcSubsPriceForCustomer = (subs, products, c) => {
    let store = {};
    for (var i = 0; i < subs.length; i++)
    {
        if (!store[subs[i].customerId])  // First time --> Add property with price 0
        {
            store[subs[i].customerId] = 0;
        }

        let product = products.find(p => p.productNumber == subs[i].productId); // Get Product
        store[subs[i].customerId] += product.salesPrice * subs[i].quantity * 12; // Calc Price
    }

    let sortedCustomerPrices = Object.entries(store).sort((a, b) => a[1] - b[1]); // Sort by price returns KeyValue array
    let length = sortedCustomerPrices.length;

    if (length > c)
    {
        return sortedCustomerPrices.slice(length - c, length).reverse();  // Return the biggest values first --> variable 'c' for how many to return
    }
    return sortedCustomerPrices;
}





//const resetFormInputsColor = (elements) =>
//{   
//    elements.address.style.backgroundColor = "white";
//    elements.city.style.backgroundColor = "white";
//    elements.zip.style.backgroundColor = "white";
//    elements.telephoneAndFaxNumber.style.backgroundColor = "white";
//    elements.email.style.backgroundColor = "white";
//    elements.corporateIdentificationNumber.style.backgroundColor = "white";
//    elements.country.style.backgroundColor = "white";
//    elements.customerGroup.style.backgroundColor = "white";
//}





export const validateCustomer = (form) =>
{
    
    let validated = true;
    let elements = form.current.elements;
    //resetFormInputsColor(elements);

    //className = {`form-control input ${addNewIsValid ? "is-valid" : "is-invalid"}`
 
    // Name
    if (elements.name.value == undefined || elements.name.value == '' || elements.name.value.length < 2) {
        elements.name.style.backgroundColor = colorRed;
        elements.name.classList.add('is-invalid');
        validated = false;
    }
    else
    {
        elements.name.style.backgroundColor = "white";
        elements.name.classList.remove('is-invalid');
        elements.name.classList.add('is-valid');
    }
    //Address
    if (elements.address.value == undefined || elements.address.value == '' || elements.address.value.length < 2) {
        elements.address.style.backgroundColor = colorRed;
        elements.address.classList.add('is-invalid');
        validated = false;
    }
    else
    {
        elements.address.style.backgroundColor = "white";
        elements.address.classList.remove('is-invalid');
        elements.address.classList.add('is-valid');
    }
    // City
    if (elements.city.value == undefined || elements.city.value == '' || elements.city.value.length < 2) {
        elements.city.style.backgroundColor = colorRed;
        elements.city.classList.add('is-invalid');
        validated = false;
    }
    else
    {
        elements.city.style.backgroundColor = "white";
        elements.city.classList.remove('is-invalid');
        elements.city.classList.add('is-valid');
    }
    // Zip
    if (elements.zip.value == undefined || elements.zip.value == '' || elements.zip.value.length < 2) {
        elements.zip.style.backgroundColor = colorRed;
        elements.zip.classList.add('is-invalid');
        validated = false;
    }
     else
    {
        elements.zip.style.backgroundColor = "white";
        elements.zip.classList.remove('is-invalid');
        elements.zip.classList.add('is-valid');
    }
    // Phone
    if (elements.telephoneAndFaxNumber.value == undefined || elements.telephoneAndFaxNumber.value == '' || elements.telephoneAndFaxNumber.value.length < 6) {
        elements.telephoneAndFaxNumber.style.backgroundColor = colorRed;
        elements.telephoneAndFaxNumber.classList.add('is-invalid');
        validated = false;
    }
     else
    {
        elements.telephoneAndFaxNumber.style.backgroundColor = "white";
        elements.telephoneAndFaxNumber.classList.remove('is-invalid');
        elements.telephoneAndFaxNumber.classList.add('is-valid');
    }
    // Email
    if (validateEmail(elements.email.value) == false)
    {     
        elements.email.style.backgroundColor = colorRed;
        elements.email.classList.add('is-invalid');
        validated = false;
    }
      else
    {
        elements.email.style.backgroundColor = "white";
        elements.email.classList.remove('is-invalid');
        elements.email.classList.add('is-valid');
    }
    //CVR
    if (elements.corporateIdentificationNumber.value == undefined || elements.corporateIdentificationNumber.value.length < 1) {
        elements.corporateIdentificationNumber.style.backgroundColor = colorRed;
        elements.corporateIdentificationNumber.classList.add('is-invalid');
        validated = false;
    }
    else
    {
        elements.corporateIdentificationNumber.style.backgroundColor = "white";
        elements.corporateIdentificationNumber.classList.remove('is-invalid');
        elements.corporateIdentificationNumber.classList.add('is-valid');
    }
    //Country
    if (elements.country.value == undefined || elements.country.value.length < 4) {
        elements.country.style.backgroundColor = colorRed;
        elements.country.classList.add('is-invalid');
        validated = false;
    }
     else
    {
        elements.country.style.backgroundColor = "white";
        elements.country.classList.remove('is-invalid');
        elements.country.classList.add('is-valid');
    }
    // CustomerGroup
    if (elements.customerGroup.value == undefined || elements.customerGroup.value == "") {
        elements.customerGroup.style.backgroundColor = colorRed;
        elements.customerGroup.classList.add('is-invalid');
        validated = false;
    }
       else
    {
        elements.customerGroup.style.backgroundColor = "white";
        elements.customerGroup.classList.remove('is-invalid');
        elements.customerGroup.classList.add('is-valid');
    }
    // Currency
    if (elements.currency.value == undefined || elements.currency.value == "") {
        elements.currency.style.backgroundColor = colorRed;
        elements.currency.classList.add('is-invalid');
        validated = false;
    }
    else
    {
        elements.currency.style.backgroundColor = "white";
        elements.currency.classList.remove('is-invalid');
        elements.currency.classList.add('is-valid');
    }


    // Currency
    if (elements.website.value == "")
    {
        elements.website.style.backgroundColor = "white";
        elements.website.classList.remove('is-invalid');
        elements.website.classList.add('is-valid');
    }
    else if (validateDomain(elements.website.value) == false) {
        elements.website.style.backgroundColor = colorRed;
        elements.website.classList.add('is-invalid');
        validated = false;
    }
    else
    {
        elements.website.style.backgroundColor = "white";
        elements.website.classList.remove('is-invalid');
        elements.website.classList.add('is-valid');
    }
   

    return validated;
}








export const validateCustomerContactPerson = (currentForm) =>
{
    let validated = true;
    let elements = currentForm.current.elements;

    // Name
    if (elements.name.value == undefined || elements.name.value == '' || elements.name.value.length < 2) {
        elements.name.style.backgroundColor = colorRed;
        elements.name.classList.add('is-invalid');
        validated = false;
    }
    else
    {
        elements.name.style.backgroundColor = colorWhite;
        elements.name.classList.remove('is-invalid');
        elements.name.classList.add('is-valid');
    }
    // Phone
    if (elements.phone.value == undefined || elements.phone.value == '' || elements.phone.value.length < 6) {
        elements.phone.style.backgroundColor = colorRed;
        elements.phone.classList.add('is-invalid');
        validated = false;
    }
    else {
        elements.phone.style.backgroundColor = colorWhite;
        elements.phone.classList.remove('is-invalid');
        elements.phone.classList.add('is-valid');
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
    // Contact Notes
    if (elements.notes.value == undefined || elements.phone.value.length > 2000) {
        elements.notes.style.backgroundColor = colorRed;
        elements.notes.classList.add('is-invalid');
        validated = false;
    }
    else {
        elements.notes.style.backgroundColor = colorWhite;
        elements.notes.classList.remove('is-invalid');
        elements.notes.classList.add('is-valid');
    }
    return validated;
}
 
