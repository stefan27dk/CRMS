import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignJustify, faBoxes, faCalendarAlt, faCalendarCheck, faCalendarDay, faCalendarPlus, faCalendarTimes, faClock, faCoins, faCube, faGlobe, faHashtag, faPen, faToolbox, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import * as _ from 'lodash';
import EditSubscriptionModal from '../Subscriptions/EditSubscriptionModal';
import { billingPeriodArr } from '../../Definitions/subscriptionsDefinitions';
import { deleteSubscriptionLogic, getSubscriptionsValues, subscriptionsTotalValuesHTML } from '../../Logic/subscriptionsLogic';
import { DDmmYYYY } from '../../Definitions/commonDefinitions';
import * as moment from 'moment';
import Table from '../common/Table';


// Class #################################################################################################################################
class CustomerSubscriptions extends Component {

    state = { editSubscriptionModalIsOpen: false, selectedSubscription: {}, customerSubscriptions: [] }

    // EditSubscriptions - Modal Toggle - Show / Hide ============================================================================================
    toggleEditSubscriptionModal = () => {
        const { editSubscriptionModalIsOpen } = this.state;
        this.setState({
            editSubscriptionModalIsOpen: !editSubscriptionModalIsOpen
        });
    }



    customerSubscriptionsColumns = [
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faHashtag} />ID</>, path: "id" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faCube} />PRODUKT</>, path: "productName" },
        { title: <><FontAwesomeIcon className="fa-lg mr-1" icon={faCalendarDay} /><FontAwesomeIcon className="fa-lg mr-2 mini-title" icon={faCoins} />PRIS - Mdl.</>, path: "salesPrice", content: (data) => data.salesPrice + " kr." },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faCalendarAlt} /><FontAwesomeIcon className="fa-lg mr-2  mini-title" icon={faCoins} />PRIS - År.</>, path: "salesPrice", content: (data) => data.salesPrice * 12 + " kr." },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faCoins} />PRIS - År. Total</>, path: "salesPrice", content: (data) => data.salesPrice * data.quantity * 12 + " kr." },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faAlignJustify} />ANTAL</>, path: "quantity" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faClock} />PERIODE</>, path: "billingPeriodType", content: (data) => this.subscriptionPeriodType(data.billingPeriodType) },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faCalendarPlus} />SIDST FAKTURERET</>, path: "lastInvoiced", content: (data) => moment(data.lastInvoiced).format(DDmmYYYY) },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faGlobe} />DOMÆNE</>, path: "domainName" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faCalendarCheck} />STARTDATO</>, path: "periodStartDate", content: (data) => moment(data.periodStartDate).format(DDmmYYYY) },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faCalendarTimes} />UDLØBSDATO</>, path: "periodEndDate", content: (data) => moment(data.periodEndDate).format(DDmmYYYY) },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faToolbox} />FUNKTIONER</>, content: (data) => this.customerSubscriptionsFunctions(data) }
    ];



    customerSubscriptionsFunctions = (data) => {
        return <><span className="no-select button-yellow no-wrap" onClick={() => this.editCustomerSubscription(data)}>REDIGER<FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faPen} /></span> | <span onClick={() =>
            deleteSubscriptionLogic(data.id, this.props.deleteSubscription)} className="no-select red-t no-wrap">SLET<FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faTrashAlt} /></span></>;
    }


    getAssambledCustomerSubscriptions = (rawSubscriptions, domains) => {
        let readySubscriptions = [];
        let assambledSubscription = {};
        let currentDomain = {};
        for (let i = 0; i < rawSubscriptions.length; i++) {
            assambledSubscription = this.assembleCustomerSubscription(rawSubscriptions[i]);
            currentDomain = domains.find(d => d.id == assambledSubscription.domainId);
            assambledSubscription.domainName = currentDomain !== undefined ? currentDomain.domainName : '';
            readySubscriptions.push(assambledSubscription);
        }
        return readySubscriptions;
    }



    // Customer Subscriptions Assemble =============================================================================================================
    assembleCustomerSubscription = (subscription) => {
        const { products } = this.props;
        let assembledSubscription = { ...subscription };

        // Product Name
        //let product = _.find(products, function (p) { return p.productNumber == subscription.productId; });
        let product = products.find(p => p.productNumber == subscription.productId);
        assembledSubscription.productName = product.name;
        assembledSubscription.salesPrice = product.salesPrice;

        return assembledSubscription;
    }



    // Subscription Period Type =============================================================================================================
    subscriptionPeriodType = (subscriptionPeriodInt) => {
        for (var i = 0; i < billingPeriodArr.length; i++) {
            if (subscriptionPeriodInt === billingPeriodArr[i].key) {
                return billingPeriodArr[i].name;
            }
        }
        return '-';
    }




    // Edit Customer Subscription =============================================================================================================
    editCustomerSubscription = (subscription) => {
        this.setState({ selectedSubscription: subscription });
        this.toggleEditSubscriptionModal();
    }





    //// Customer Subscriptions ============================================================================================================= 
    //renderCustomerSubscriptions = () =>
    //{
    //    const { domains, customerId, subscriptions } = this.props;
    //    const customerSubscriptions = subscriptions.filter(s => s.customerId == customerId);
    //    return (
    //        <>
    //            {/*Info Container*/}
    //            <div className="mt-5 table-container table-responsive subDiv">
    //                <Table tableColumns={this.customerSubscriptionsColumns} tableData={this.getAssambledCustomerSubscriptions(customerSubscriptions, domains)} tableContainerClass={'table-holder-h-fit'} tableId={'customerSubscriptionsTable'} tableTitle={"NUVÆRENDE ABONEMENTER"} excelFilter={'removeLastColumn'} />
    //            </div>
    //        </>
    //    );
    //}




    totalSubscriptionsValues = (subscriptions, products) => {
        let totalSubsValues = getSubscriptionsValues(subscriptions, products);
        return subscriptionsTotalValuesHTML('', totalSubsValues.yearly, totalSubsValues.monthly);
    }


    setStateEditSubscriptionModalIsOpen = (bool) => {
        this.setState({ editSubscriptionModalIsOpen: bool });
    }

    // Render ===================================================================================================================
    render() {
        const { editSubscriptionModalIsOpen, selectedSubscription } = this.state;
        const { products, domains, subscriptions, customerId } = this.props;
        if (products[0] == undefined || domains[0] == undefined) return '';
        let customerSubs = this.getAssambledCustomerSubscriptions(subscriptions.filter(s => s.customerId == customerId), domains);
        return (
            <>
                {/*CUSTOMER - SUBSCRIPTIONS*/}
                <div className="mt-5 table-container table-responsive subDiv">
                    <Table tableColumns={this.customerSubscriptionsColumns} tableData={customerSubs}
                        tableContainerClass={'table-holder-h-fit'} tableId={'customerSubscriptionsTable'}
                        tableTitle="NUVÆRENDE ABONNEMENTER" tableIcon={<><FontAwesomeIcon className="fa-lg mr-4" icon={faBoxes} />NUVÆRENDE ABONNEMENTER</>} excelFilter={'removeLastColumn'}
                        html={this.totalSubscriptionsValues(customerSubs, products)} />
                </div>
                <EditSubscriptionModal subscription={selectedSubscription} toggleEditSubscriptionModal={() => this.toggleEditSubscriptionModal()} editSubscriptionModalIsOpen={editSubscriptionModalIsOpen} setStateEditSubscriptionModalIsOpen={this.setStateEditSubscriptionModalIsOpen} />
            </>
        );
    }

}

export default CustomerSubscriptions;



