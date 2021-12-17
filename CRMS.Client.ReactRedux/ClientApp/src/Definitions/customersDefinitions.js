import { faAsterisk, faCity, faHashtag, faIdCard, faLayerGroup, faMapMarkerAlt, faPhoneSquareAlt, faSignal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';


export const customersColumns = [
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faHashtag} />ID</>, path: "customerNumber" },
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faIdCard} />NAVN</>, path: "name" },
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faSignal} />STATUS</>, path: "status", content: (data) => customerStatusIcon(data.status) }, // Status Icon
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faLayerGroup} />KUNDEGRUPPE</>, path: "customerGroup.customerGroupNumber", content: (data) => data.customerGroup.customerGroupNumber },
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faMapMarkerAlt} />ADRESSE</>, path: "address" },
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faCity} />BY</>, path: "city" },
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faAsterisk} />POSTNR</>, path: "zip" },
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faPhoneSquareAlt} />TELEFON</>, path: "telephoneAndFaxNumber" }];




const customerStatusIcon = (statusValue) => {
    if (statusValue === 'green') {
        return <img alt="" className="customer-status-img" src="/img/status_green.png" />;
    }
    else if (statusValue === 'white') {
        return <img alt="" className="customer-status-img" src="/img/status_neutral.png" />;
    }
    else {
        return <img alt="" className="customer-status-img" src="/img/status_red.png" />;
    }
}



export const defaultNewcustomer = { country: "Danmark", currency: "DKK", vatZone: { vatZoneNumber: 1 }, website: "", paymentTerms: { paymentTermsNumber: 2 }, customerGroup: { customerGroupNumber: 1 } };




