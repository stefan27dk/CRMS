import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import Table from '../common/Table';


// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPen, faHashtag, faIdCard, faAsterisk, faLayerGroup, faStream, faCube, faCalendarCheck, faCalendarTimes, faCalendarDay, faCoins, faCalendarAlt, faToolbox, faCubes, faAngleDoubleRight, faAlignCenter, faBoxes } from '@fortawesome/free-solid-svg-icons'
import { deleteSubscription, fetchSubscriptions } from '../../actions/subscriptionsActions';
import EditSubscriptionModal from './EditSubscriptionModal';
import { deleteSubscriptionLogic, getSubscriptionsValues, subscriptionsTotalValuesHTML } from '../../Logic/subscriptionsLogic';
import { DDmmYYYY } from '../../Definitions/commonDefinitions';
import SubscriptionsPeriodOverview from './SubscriptionsPeriodOverview';


// Class #################################################################################################################################
class Subscriptions extends Component {

    // Subscription Columns
    columns = [{ title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faHashtag} />ID</>, path: "id" },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faIdCard} />FIRMANAVN</>, path: "customerName" },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faAsterisk} />POSTNR.</>, path: "zip" },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faLayerGroup} />KUNDEGRUPPE</>, path: "customerGroupNumber" },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faStream} />ANTAL</>, path: "quantity" },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faCube} />PRODUKT</>, path: "productName" },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faCalendarCheck} />PERIODE FRA</>, path: "periodStartDate", content: (data) => moment(data.periodStartDate).format(DDmmYYYY) },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faCalendarTimes} />PERIODE UDLØBER</>, path: "periodEndDate", content: (data) => moment(data.periodEndDate).format(DDmmYYYY) },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faCalendarDay} /><FontAwesomeIcon className="fa-lg mr-1 mini-title" icon={faCoins} />PRIS PR. MD.</>, path: "monthPrice", content: (data) => data.monthPrice + ' kr.' },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faCalendarAlt} /><FontAwesomeIcon className="fa-lg mr-1 mini-title" icon={faCoins} />PRIS PR. ÅR</>, path: "yearPrice", content: (data) => data.yearPrice + ' kr.' },
    { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faToolbox} />FUNKTIONER</>, content: (data) => this.subscriptionFunctions(data) }
    ];



    // Functions - Subscription ==============================================================================================================
    subscriptionFunctions = (data) => {
        return <><span className="no-select button-yellow no-wrap" onClick={() => this.editCustomerSubscription(data)}>REDIGER<FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faPen} /></span> | <span onClick={() =>
            deleteSubscriptionLogic(data.id, this.props.deleteSubscription)} className="no-select red-t no-wrap">SLET<FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faTrashAlt} /></span></>;
    }


    // Refs
    periodStartInput = React.createRef();
    periodEndtInput = React.createRef();



    // STATE                                
    state = { pickedSubscription: {}, editPickedSubscriptionModalIsOpen: false, overViewModalIsOpen: false, subRange: false }

    totalValues = '';

    // Load Data Based on option
    loadDataBasedOnOption = () => {
        const { subRange } = this.state;
        if (subRange === true) {
            return this.subscriptionsGetRange();
        }
        else {
            return this.loadAllSubscriptions();
        }
    }



    // Load all Subscriptions ===================================================================================================================
    loadAllSubscriptions = () => {
        const { products, customers, subscriptions } = this.props;
        return this.buildSubscriptions(products, customers, subscriptions);
    }




    // EditSubscriptions - Modal Toggle - Show / Hide ============================================================================================
    toggleEditSubscriptionModal = () => {
        const { editPickedSubscriptionModalIsOpen } = this.state;
        this.setState({
            editPickedSubscriptionModalIsOpen: !editPickedSubscriptionModalIsOpen
        });
        this.loadDataBasedOnOption();
    }






    // Overview - Modal Toggle - Show / Hide ============================================================================================
    toggleOverViewModal = () => {
        const { overViewModalIsOpen } = this.state;
        this.setState({
            overViewModalIsOpen: !overViewModalIsOpen
        });
    }





    // Edit Customer Subscription =============================================================================================================
    editCustomerSubscription = (subscription) => {
        this.setState({ pickedSubscription: subscription });
        this.toggleEditSubscriptionModal();
    }





    // HandelOnRowCLick ===================================================================================================================
    handelOnRowClick = (item) => {

        //this.props.history.push(`Subscription/${item.customerNumber}`);
    }





    // Build Subscription ===================================================================================================================
    buildSubscriptions = (products, customers, subscriptions) => {
        let buildSubscriptions = [];
        if (products[0] != undefined && customers[0] != undefined && subscriptions[0] != undefined) {
            for (let i = 0; i < subscriptions.length; i++) {
                let customer = customers.filter(c => c.customerNumber == subscriptions[i].customerId);
                let product = products.filter(p => p.productNumber == subscriptions[i].productId);
                let assembledSubscription = {}

                assembledSubscription.customerId = subscriptions[i].customerId;
                assembledSubscription.id = subscriptions[i].id;
                assembledSubscription.domainId = subscriptions[i].domainId;
                assembledSubscription.customerName = customer[0].name;
                assembledSubscription.zip = customer[0].zip;
                assembledSubscription.customerGroupNumber = customer[0].customerGroup.customerGroupNumber;
                assembledSubscription.quantity = subscriptions[i].quantity;
                assembledSubscription.productName = product[0].name;
                assembledSubscription.productId = +product[0].productNumber;
                assembledSubscription.periodStartDate = subscriptions[i].periodStartDate.slice(0, 10);
                assembledSubscription.periodEndDate = subscriptions[i].periodEndDate.slice(0, 10);
                assembledSubscription.billingPeriodType = subscriptions[i].billingPeriodType;
                assembledSubscription.lastInvoiced = subscriptions[i].lastInvoiced.slice(0, 10);
                assembledSubscription.description = subscriptions[i].description;
                assembledSubscription.yearPrice = product[0].salesPrice * subscriptions[i].quantity * 12;
                assembledSubscription.monthPrice = product[0].salesPrice * subscriptions[i].quantity;
                buildSubscriptions.push(assembledSubscription);
            }
        }

        let totalSubsValues = getSubscriptionsValues(buildSubscriptions, products);
        this.totalValues = subscriptionsTotalValuesHTML('', totalSubsValues.yearly, totalSubsValues.monthly);
        /* "Periode: | Årlig - " + subValues.yearly + " kr. |" + "  Mdl - " + subValues.monthly + " kr.|";*/
        return buildSubscriptions;
    }





    // On CHange - FROM / TO - DATE  ===================================================================================================================
    onChangeFromToInput = (e) => {
        // IF - From - START
        if (e.target.name === 'periodStart') {
            // If END / TO is empty - set to START VALUE
            if (this.periodEndtInput.current.value === '') {
                this.periodEndtInput.current.value = this.periodStartInput.current.value;  // Set END Value to START
            }
            else if (this.periodStartInput.current.value >= this.periodEndtInput.current.value)  // If START VALUE is bigger than END, Set END VALUE to START
            {
                this.periodEndtInput.current.value = this.periodStartInput.current.value;
            }

            this.periodEndtInput.current.min = this.periodStartInput.current.value; // Update the Minimum value of the END
        }

        // IF - TO - END
        else if (e.target.name === 'periodEnd') {
            // IF START is empty
            if (this.periodStartInput.current.value === '') {
                let today = new Date().toISOString().slice(0, 7); // TODAY
                if (this.periodEndtInput.current.value >= today) // IF END VALUE IS Bigger than today set START to TODAY -----> Else START VALUE = END
                {
                    this.periodStartInput.current.value = today;
                    this.periodEndtInput.current.min = this.periodStartInput.current.value; // Update the Minimum value of the END
                }
                else // Else START VALUE = END - If END  smaller than today
                {
                    this.periodStartInput.current.value = this.periodEndtInput.current.value;
                    this.periodEndtInput.current.min = this.periodStartInput.current.value; // Update the Minimum value of the END
                }
            }
        }

        this.setState({ subRange: true })
        //this.subscriptionsGetRange();
    }





    // Subscriptions Get Range ===================================================================================================================
    subscriptionsGetRange = () => {
        // Props
        const { products, customers, subscriptions } = this.props;

        // Convert Input Values to Dates
        const startDateInputValue = moment(this.periodStartInput.current.value + '-01', DDmmYYYY);
        const endDateInputValue = moment(this.periodEndtInput.current.value + '-01', DDmmYYYY);

        // Get Subscription for the date range
        const subscriptionsRange = subscriptions.filter(s => {
            // For every subscription convert the date value to Date
            const startDate = moment(s.periodStartDate, DDmmYYYY);
            //const endDate = moment(s.periodEndDate, Dateformat);

            // Compare
            return startDate >= startDateInputValue && startDate <= endDateInputValue;
        });


        return this.buildSubscriptions(products, customers, subscriptionsRange);
    }





    //// Get Subscriptions Values - Price .kr  ===================================================================================================================
    //getSubscriptionsValues = (subscriptions, products) =>
    //{
    //    let totalYearValue = 0;
    //    let monthlyValue = 0;
    //    for (var i = 0; i < subscriptions.length; i++)
    //    {   
    //        let product = products.filter(p => p.productNumber == subscriptions[i].productId);
    //        totalYearValue += product[0].salesPrice * subscriptions[i].quantity * 12;     
    //        monthlyValue += product[0].salesPrice * subscriptions[i].quantity;
    //    }
    //    return { yearly: totalYearValue, monthly: monthlyValue };
    //}








    // Extra Html for table - FROM - TO  ===================================================================================================================
    injectTableHtml = () => {
        return (
            <div className="inline-lr">
                <button type="button" onClick={() => { this.setState({ subRange: false }); this.loadAllSubscriptions(); this.periodStartInput.current.value = ""; this.periodEndtInput.current.value = ""; }} className="btn btn-primary max-heigh-35px m-t-b-auto mr-4 text-nowrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faCubes} />Vis Alle</button>
                <span className="inline h5">Fra:</span>
                <input ref={this.periodStartInput} name="periodStart" onKeyDown={(e) => e.preventDefault()} className="form-control input-month" type="month" onChange={this.onChangeFromToInput} />
                <span className="inline h5 ml-3">Til:</span>
                <input ref={this.periodEndtInput} name="periodEnd" onKeyDown={(e) => e.preventDefault()} className="form-control input-month" type="month" onChange={this.onChangeFromToInput} />
                <button type="button" onClick={this.toggleOverViewModal} className="btn btn-primary max-heigh-35px m-t-b-auto mr-3 text-nowrap"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faAlignCenter} />Vis Oversigt</button>
                <br/>
            </div>
        );
    }



    allSubscriptionsTotalValues = (subscriptions, products) => {
        let values = getSubscriptionsValues(subscriptions, products);
        return subscriptionsTotalValuesHTML('', values.yearly, values.monthly);
    }



    setStateeditPickedSubscriptionModalIsOpen = (bool) => {
        this.setState({ editPickedSubscriptionModalIsOpen: bool });
    }



    // Render =====================================================================================================================================
    render() {
        // State
        const { pickedSubscription, editPickedSubscriptionModalIsOpen, overViewModalIsOpen, subRange } = this.state;
        const { products, customers, subscriptions } = this.props;
        //this.buildSubscriptions(products, customers, subscriptions);
        // Loading

        if (customers.length === 0 || products.length === 0 || subscriptions.length === 0) return <p>Loader...</p>;

        let subData = customers.length !== 0 || products.length !== 0 || subscriptions.length !== 0 ? this.loadDataBasedOnOption() : [{}];
        //if (!this.props.isLoaded) return <p>Loader...</p>;

        // Return HTML        
        return (
            <div>
                <SubscriptionsPeriodOverview overviewModalIsOpen={overViewModalIsOpen} toggleOverViewModal={this.toggleOverViewModal} data={subData} columns={this.columns} totalValues={this.totalValues} />
                <EditSubscriptionModal subscription={pickedSubscription} toggleEditSubscriptionModal={() => this.toggleEditSubscriptionModal()} editSubscriptionModalIsOpen={editPickedSubscriptionModalIsOpen} setStateEditSubscriptionModalIsOpen={this.setStateeditPickedSubscriptionModalIsOpen} />
                {/*Subscriptions - CONTENT ====================================================================================================================================*/}
                <Table onRowClick={this.handelOnRowClick} html={this.injectTableHtml()} tableColumns={this.columns} tableData={subData} tableTitle="ABONNEMENTER" tableIcon={<span className="ml-2 inline"><FontAwesomeIcon className="fa-lg mr-2" icon={faBoxes} /> ABONNEMENTER </span>} excelFilter={'removeLastColumn'} />
                {this.allSubscriptionsTotalValues(subscriptions, products)}
                <p id="periodValueLabel" className="ml-4 no-wrap font-weight-bold m-t-b-auto">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Periode:{this.totalValues}</p>
            </div>
        );
    }

}





// Default Redux
// Prop Types =====================================================================================================================================
Subscriptions.propTypes = {
    fetchSubscriptions: PropTypes.func.isRequired,
    subscriptions: PropTypes.array.isRequired,
};



// Map STATE to Props ==============================================================================================================================
const mapStateToProps = state => ({
    customers: state.customers.list,
    subscriptions: state.subscriptions.list,
    products: state.products.list,
    isLoaded: state.customers.isLoaded,
    Users: state.users
});

export default connect(mapStateToProps, {
    fetchSubscriptions,
    deleteSubscription
})(Subscriptions);










