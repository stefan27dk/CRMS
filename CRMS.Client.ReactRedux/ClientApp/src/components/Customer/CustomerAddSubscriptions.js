import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignJustify, faBox, faCalendarCheck, faClock, faCoins, faExclamationTriangle, faGlobe, faHashtag, faPlus, faPlusCircle, faSignature, faStream } from '@fortawesome/free-solid-svg-icons'
import * as _ from 'lodash';
import { onlyNumbers, tryConvertToInt } from '../../Logic/validationLogic';
import Table from '../common/Table';
import { billingPeriodArr } from '../../Definitions/subscriptionsDefinitions';
import { colorRed, colorWhite } from '../../Definitions/commonDefinitions';
import { MESSAGE_TYPE } from '../../actions/types';
import * as moment from 'moment';
import store from '../../store';



// Class #################################################################################################################################
class CustomerAddSubscriptions extends Component {

    //state = { quantityInputValue: 1};
    //quantityInput = React.createRef();
    //billingPeriodTypeInput = React.createRef();
    //startDateInput = React.createRef();
    //domainsInput = React.createRef();


    // Product Unit select =================================================================================================================================================
    //selectProductUnit = (unitValue) =>
    //{
    //if (unitValue !== undefined) {
    //    if (unitValue.unitNumber === 1) {
    //        return <p className="column-item-center">stk.</p>;
    //    }
    //    else {
    //        return <span className="column-item-center">mdr.</span>;
    //    }
    //}
    //else {      
    //    return <p className="column-item-center">-</p>;
    //}
    //} 



    // Customer Add - Subscription ============================================================================================================= 
    addSubscription = (productId) => {
        const { domains } = this.props;

        let quantity = this.getInput("quantity" + productId + 1);

        if (quantity.value == "0") {
            this.errorMessageNoDomains("Antal skal være et tal større end 0!");
            return;
        }
        else if (domains.length != 0) {


            const { customerId } = this.props;
            let period = this.getInput("billingPeriodType" + productId + 2);

            let startDate = this.getInput("periodStartDate" + productId + 3);
            let domain = this.getInput("domainId" + productId + 4);
            let today = new Date().toISOString();
            let endDate = "";

            if (period.value === "0") {
                let date = new Date(startDate.value + '-01');
                date.setMonth(date.getMonth() + 12); // Add 12 Months
                endDate = date.toISOString().slice(0, 10); // To YYYY-mm-DD

            }
            else if (period.value === "1") {
                let date = new Date(startDate.value + '-01');
                date.setMonth(date.getMonth() + 6); // Add 6 Months
                endDate = date.toISOString().slice(0, 10); // To YYYY-mm-DD

            }
            else if (period.value === "2") {
                let date = new Date(startDate.value + '-01');
                date.setMonth(date.getMonth() + 3); // Add 3 Months
                endDate = date.toISOString().slice(0, 10); // To YYYY-mm-DD  
            }
            else if (period.value === "3") {
                let date = new Date(startDate.value + '-01');
                date.setMonth(date.getMonth() + 1); // Add 1 Month
                endDate = date.toISOString().slice(0, 10); // To YYYY-mm-DD
            }


            let subscription = {
                "id": 0,
                "quantity": tryConvertToInt(quantity.value),
                "billingPeriodType": tryConvertToInt(period.value),
                "creationDate": today,
                "periodStartDate": startDate.value + '-01',
                "periodEndDate": endDate,
                "lastInvoiced": today,
                "productId": tryConvertToInt(productId),
                "customerId": customerId,
                "description": "",
                "domainId": tryConvertToInt(domain.value)
            };

            /* console.log(subscription);*/
            // Create ubscription
            this.props.addCustomerSubscription(subscription);
        }
        else {
            this.errorMessageNoDomains("Der er Ingen Domæner på Kunden - Kan ikke tilføje abonnement!");
        }
    }




    // Get Input ============================================================================================================= 
    getInput = (elementId) => {
        return document.getElementById(elementId);
    }




    validateQuantityInput = (e) => {
        let value = e.currentTarget.value;
        if (value && value.trim() !== '') {
            let isInt = +value;
            if (isNaN(isInt) !== true && isInt !== 0) {
                e.currentTarget.style.backgroundColor = colorWhite;
                return true;
            }
            e.currentTarget.style.backgroundColor = colorRed;
            return false;
        }
    }



    errorMessageNoDomains = (msg) => {
        // Dispatch - Loading -------------------------
        store.dispatch({
            type: MESSAGE_TYPE,
            payload:
            {
                messageType: 'error',
                messageContent: msg,
                time: moment().add(3, 'seconds').valueOf()
            }
        });
    }



    // Render ===================================================================================================================
    render() {
        const { products, subscriptions, domains } = this.props;

        if (products[0] == undefined || subscriptions == undefined) { return <p>...</p> }

        // Subscriptions Columns
        const addSubscriptionsColumns =
            [
                { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faHashtag} />ID</>, path: "productNumber" },
                { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faSignature} />NAVN</>, path: "name" },
                { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faCoins} />PRIS</>, path: "salesPrice", content: (data) => { if (data.salesPrice !== undefined) { return data.salesPrice + " kr."; } else { return ""; } } },
                { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faStream} />ENHED</>, path: "unit", content: (data) => data.unit != undefined ? data.unit.name : "-" },
                { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faAlignJustify} />ANTAL</>, path: "", content: (data) => <input name="quantity" id={"quantity" + data.productNumber + 1} className="input-n-2 form-control" type="text" onKeyDown={onlyNumbers} onChange={this.validateQuantityInput} maxLength="2" defaultValue="1" /> },

                // PERIOD
                {
                    title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faClock} />PERIODE</>, path: "", content: (data) =>
                        <div className="inline"><select name="billingPeriodType" id={"billingPeriodType" + data.productNumber + 2} value={subscriptions.billingPeriodType} className="form-control input-period" onChange={this.handleChangeSubscription}>
                            {
                                billingPeriodArr.map((periodType, index) => {
                                    return <option key={index} value={periodType.key}>{periodType.name}</option>
                                })
                            }
                        </select></div>
                },

                // Start Date
                {
                    title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faCalendarCheck} />STARTDATO</>, path: "", content: (data) =>
                        <input name="periodStartDate" id={"periodStartDate" + data.productNumber + 3} onKeyDown={(e) => e.preventDefault()} className="form-control input-start-date" type="month" defaultValue={new Date().toISOString().slice(0, 7)} />
                },


                // Domains
                {
                    title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faGlobe} />DOMÆNE</>, path: "", content: (data) => domains.length != 0 ?
                        <select name="domainId" id={"domainId" + data.productNumber + 4} defaultValue={domains[0]} className="form-control">
                            {
                                domains.map((domain, index) => {
                                    return <option key={index} value={domain.id}>{index + 1}: {domain.domainName}</option>
                                })
                            }
                        </select> : <p className="font-weight-bold"><FontAwesomeIcon className="fa-lg mr-2" icon={faExclamationTriangle} />Ingen Domæner</p>
                },

                // Add Subscription to Customer
                { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faPlus} />TILFØJ</>, path: "", content: (data) => <span onClick={() => this.addSubscription(data.productNumber)} className="ico-dark middle-icon no-select"><FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faPlusCircle} /></span> }

            ];




        //RETURN
        return (
            <div className="mt-5 table-container table-responsive subDiv">
                <Table tableColumns={addSubscriptionsColumns} tableData={products} tableTitle="TILFØJ ABONNEMENTER" tableIcon={<span><FontAwesomeIcon className="fa-lg mr-1" icon={faPlus} /><FontAwesomeIcon className="fa-lg mr-4" icon={faBox} />TILFØJ ABONNEMENTER</span>} excelFilter={'removeLastColumn'} tableId={'customerAddSubscriptionTable'} />
            </div>
        );
    }

}
export default CustomerAddSubscriptions;



