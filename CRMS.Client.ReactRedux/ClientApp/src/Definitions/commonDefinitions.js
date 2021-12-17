import React from 'react';
import store from '../store';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleDown, faFileExcel, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import * as moment from 'moment';

// Excel
import ReactHTMLTableToExcel from 'react-html-table-to-excel';



// Actions
import { fetchCustomers, fetchCvrApiAddress } from '../actions/customersActions';
import { fetchProducts } from '../actions/productsActions';
import { fetchProductGroups } from '../actions/productActions';
import { fetchSubscriptions } from '../actions/subscriptionsActions';
import { fetchAllDomains } from '../actions/domainsActions';
import { fetchInvoiceDrafts } from '../actions/InvoicesActions';



// Date Formats 
export const DDmmYYYY = "DD-MM-yyyy";
export const DDmmYYYYhhMMss = "DD-MM-YYYY HH:mm:ss";
export const DDmmYYYYhhMMssDash = "DD-MM-YYYY -- HH-mm-ss";



// Units
export const units = [{ id: 0, name: "" }, { id: 1, name: "stk." }, { id: 2, name: "mdr." }, { id: 4, name: "timer" }];




// Export to Excel Button
export const excelButton = (fileName, dataCount, tableId, excelFilter) => {
    return (<ReactHTMLTableToExcel
        id={fileName + "-excel-button"}
        table={tableId}
        filter={excelFilter == 'removeLastColumn' ? excelFilterRemoveLastColumn : excelFilterDefault}
        className="btn btn-success max-heigh-35px m-t-b-auto mr-4 ml-5 text-nowrap"
        filename={fileName + " " + dataCount + " --" + moment().format(" " + DDmmYYYYhhMMssDash)}
        sheet="tablexls"
        buttonText={<><FontAwesomeIcon className="fa-lg mb-2" icon={faFileExcel} /> <FontAwesomeIcon className="fa-lg mb-2" icon={faArrowAltCircleDown} /></>} />);
}




// Excel
export const excelFilterRemoveLastColumn = () => {
    ReactHTMLTableToExcel.format = (s, c) => {
        if (c && c['table']) {
            const html = c.table;
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const rows = doc.querySelectorAll('tr');

            for (const row of rows) {
                row.removeChild(row.lastChild);
            }

            c.table = doc.querySelector('table').outerHTML;
        }
        return s.replace(/{(\w+)}/g, (m, p) => c[p]);
    };
}






// Excel
export const excelFilterDefault = () => {
    ReactHTMLTableToExcel.format = (s, c) => {
        if (c && c['table']) {
            const html = c.table;
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            c.table = doc.querySelector('table').outerHTML;
        }
        return s.replace(/{(\w+)}/g, (m, p) => c[p]);
    };
}




// Dispatch All
export const dispatchAllToReduxStore = () => {
    // Load components states on page initial load
    store.dispatch(fetchCustomers());
    store.dispatch(fetchProducts());
    store.dispatch(fetchSubscriptions());
    store.dispatch(fetchProductGroups());
    store.dispatch(fetchInvoiceDrafts());
    store.dispatch(fetchCvrApiAddress());
}





//export const isUserLoggedIn = () => {
//    return localStorage.getItem('IsLoggedIn');
//}


//export const setIsUserLoggedIn = (value) =>
//{
//    localStorage.setItem('IsLoggedIn', value);
//}      





// Edit & Delete Buttons
export const editAndDeleteButtonHtml = (editFunc, deleteFunc, data) => {
    return <><span className="no-select button-yellow no-wrap"
        onClick={() => editFunc(data)}>REDIGER<FontAwesomeIcon
            className="fa-lg ml-3 mr-2" icon={faPen} /></span> | <span onClick={() => deleteFunc(data)} className="no-select red-t no-wrap">SLET<FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faTrashAlt} /></span></>;
}




// Only Delete Button
export const deleteButtonHtml = (deleteFunc, data) => {
    return <span onClick={() => deleteFunc(data)} className="no-select red-t no-wrap">SLET<FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faTrashAlt} /></span>;
}



export const blueButtonSmall = (onClick, buttonText, type) => {
    return <button className="btn btn-primary mr-1 max-heigh-35px m-t-b-auto no-wrap" onClick={onClick} type={type}>{buttonText}</button>;
}


// COLORS
export const colorRed = 'rgb(255, 122, 112)';
export const colorWhite = 'white';








// Algorithms
export const convertObjToUrlParams = (obj) => {
    var paramString = '';
    for (let key in obj) {
        if (obj[key] !== null && obj[key] !== undefined) {
            paramString += '&';
            paramString += key + "=" + obj[key];
        }
    }
    return paramString;
}


