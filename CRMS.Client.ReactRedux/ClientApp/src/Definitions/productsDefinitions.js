import { faBoxes, faCoins, faHashtag, faInfoCircle, faLayerGroup, faSignature, faStream, faTimes, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';


export const productsColumns = [
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faHashtag} />ID</>, path: "productNumber" },
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faSignature} />NAVN</>, path: "name" },
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faCoins} />PRIS</>, path: "salesPrice", content: (data) => { if (data.salesPrice !== undefined) { return data.salesPrice + " kr."; } else { return ""; } } },
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faStream} />ENHED</>, path: "unit", content: (data) => data.unit !== undefined && data.unit !== null ? data.unit.name : '-' },
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faInfoCircle} />BESKRIVELSE</>, path: "description" },
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faLayerGroup} />PRODUKTGRUPPE</>, path: "productGroup.productGroupNumber", content: (data) => data.productGroup.productGroupNumber },
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faUsers} />ANTAL KUNDER</>, path: "customersCount" },
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faBoxes} />ANTAL ABONNEMENTER</>, path: "subscriptionsCount" },
    { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faTimes} />TILSTAND</>, path: "barred", content: (data) => data.barred !== undefined ? data.barred === true ? 'Inaktiv' : 'Aktiv' : '-' }];






