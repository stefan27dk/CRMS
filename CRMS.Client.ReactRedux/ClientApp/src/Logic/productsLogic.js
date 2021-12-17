import { colorRed, colorWhite } from "../Definitions/commonDefinitions";

export const getMostOccurringProducts = (subscriptions, c) => {
    let store = {}; // Stores the collection of subscriptions {ID:Count}
    let mostOcurr = '', count = 0;
    for (let s of subscriptions) {
        if (store[s.productId]) // If there is property with the name of the Subscription.ProductId
        {
            store[s.productId].count++; // Increase count in collection
            store[s.productId].quantity += s.quantity;
        }
        else {
            store[s.productId] = { count: 1 };
            store[s.productId].quantity = s.quantity;
        }
        if (count < store[s.productId])  // Count holds the highest count of all in the collection --> If count is smaller
        {
            mostOcurr = s.productId; // Assign the most occurrent productId to mostOcurr
            count = store[s.productId] // Assign the count of the mostocurrent product to count
        }
    }


    let keyValues = Object.entries(store).sort((a, b) => a[1].count - b[1].count);

    let length = keyValues.length;
    if (length > c)
    {
        return keyValues.slice(length - c, length).reverse();
    }
    return keyValues;
}






 



export const validateProduct = (currentForm) =>
{

    let validated = true;
    let elements = currentForm.current.elements;
 

    // Name
    if (elements.name.value == undefined || elements.name.value == '' || elements.name.value.length < 2) {
        elements.name.style.backgroundColor = colorRed;
        elements.name.classList.add('is-invalid');
        validated = false;
    }
    else {
        elements.name.style.backgroundColor = colorWhite;
        elements.name.classList.remove('is-invalid');
        elements.name.classList.add('is-valid');
    }
    // Price
    if (elements.salesPrice.value == undefined || elements.salesPrice.value == '')
    {
        elements.salesPrice.style.backgroundColor = colorRed;
        elements.salesPrice.classList.add('is-invalid');
        validated = false;
    }
    else {
        elements.salesPrice.style.backgroundColor = colorWhite;
        elements.salesPrice.classList.remove('is-invalid');
        elements.salesPrice.classList.add('is-valid');
    }
    
    // Description
    if (elements.description.value == undefined || elements.description.value == '')
    {
        elements.description.style.backgroundColor = colorRed;
        elements.description.classList.add('is-invalid');
        validated = false;
    }
    else {
        elements.description.style.backgroundColor = colorWhite;
        elements.description.classList.remove('is-invalid');
        elements.description.classList.add('is-valid');
    }

    return validated;
}







