import { faAsterisk, faCalendar, faCalendarPlus, faCashRegister, faCity, faHashtag, faHourglassEnd, faHourglassHalf, faIdCard, faIndustry, faMapMarker, faMapMarkerAlt, faMoneyBillWave, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';


export const invoiceDraftsColumns = [
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faHashtag} />ID</>, path: "draftInvoiceNumber" },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faIdCard} />KUNDE-NAVN</>, path: "recipient.name", content: (data) => data.recipient.name },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faHashtag} /><FontAwesomeIcon className="fa-lg mr-1 mini-title" icon={faIdCard} />KUNDE-ID</>, path: "customer.customerNumber", content: (data) => data.customer.customerNumber },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faMapMarkerAlt} />KUNDE-ADRESSE</>, path: "recipient.address", content: (data) => data.recipient.address },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faAsterisk} />KUNDE-POSTNR</>, path: "recipient.zip", content: (data) => data.recipient.zip },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faCity} />KUNDE-BY</>, path: "recipient.city", content: (data) => data.recipient.city },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faHashtag} /><FontAwesomeIcon className="fa-lg mr-1 mini-title" icon={faIndustry} />KUNDE-CVR</>, path: "recipient.cvr", content: (data) => data.recipient.cvr },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faCalendarPlus} />OPR.DATO</>, path: "date" },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faCalendar} /><FontAwesomeIcon className="fa-lg mr-1 mini-title" icon={faHourglassHalf} />LEVERINGSDATO</>, path: "delivery.deliveryDate", content: (data) => data.delivery?.deliveryDate },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faCalendar} /><FontAwesomeIcon className="fa-lg mr-1 mini-title" icon={faHourglassEnd} />FORFALDSDATO</>, path: "dueDate" },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faMoneyBillWave} />VALUTA</>, path: "currency" },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faCashRegister} />MOMS</>, path: "vatAmount" },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faReceipt} />BET.BETINGELSER</>, path: "paymentTerms.name", content: (data) => data.paymentTerms.name }
];






