import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { tryConvertToInt, onlyNumbers } from '../../Logic/validationLogic';
import { updateSubscription } from '../../actions/subscriptionsActions';
import { billingPeriodArr } from '../../Definitions/subscriptionsDefinitions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignJustify, faBox, faCalendarCheck, faCalendarPlus, faCalendarTimes, faClock, faCube, faExclamationTriangle, faGlobe, faHashtag, faPen, faSave } from '@fortawesome/free-solid-svg-icons';
import { colorRed, colorWhite } from '../../Definitions/commonDefinitions';




// Class #################################################################################################################################
class EditSubscriptionsModal extends Component {
    state = { editSelectedSubscription: {} }

    periodEndDateInput = React.createRef();
    periodStartDateInput = React.createRef();
    periodTypeInput = React.createRef();


    // Component did update ============================================================================================================= 
    componentDidUpdate() {
        const { editSelectedSubscription } = this.state;
        const { subscription } = this.props;

        if (subscription != undefined) {
            // If Different Subscription Fetch Data
            if (subscription.id != editSelectedSubscription.id) {
                this.loadData();
            }
        }
    }




    // Input Handle Change Subscription ============================================================================================================= 
    handleChangeSubscription = (e) => {
        const { editSelectedSubscription } = this.state;

        this.validateQuantityInput();

        if (e.target.name === 'periodStartDate' || e.target.name === 'billingPeriodType') {

            // Date
            let date = new Date(this.periodStartDateInput.current.value + '-01');

            // IF
            if (this.periodTypeInput.current.value == "0") {
                date.setMonth(date.getMonth() + 12); // Add 12 Months     
            }
            else if (this.periodTypeInput.current.value == "1") {
                date.setMonth(date.getMonth() + 6); // Add 6 Months
            }
            else if (this.periodTypeInput.current.value == "2") {
                date.setMonth(date.getMonth() + 3); // Add 3 Months
            }
            else if (this.periodTypeInput.current.value == "3") {
                date.setMonth(date.getMonth() + 1); // Add 1 Month
            }


            let endDate = date.toISOString().slice(0, 10);

            let propsForUpdate = { periodEndDate: endDate, periodStartDate: this.periodStartDateInput.current.value + '-01', billingPeriodType: tryConvertToInt(this.periodTypeInput.current.value) };

            let subscriptionPeriod = { ...editSelectedSubscription, ...propsForUpdate }
            this.setState({ editSelectedSubscription: subscriptionPeriod });

            //console.log(editSelectedSubscription.periodEndDate);
            this.periodEndDateInput.current.value = endDate.slice(0, 7);
        }
        else {
            const subscription = { ...editSelectedSubscription, [e.target.name]: tryConvertToInt(e.target.value) }
            this.setState({ editSelectedSubscription: subscription });
        }
    }


    updateSubscriptionButtonBlock = { block: false };



    // Update Subscription ============================================================================================================= 
    updateSubscription = () => {
        const { setStateEditSubscriptionModalIsOpen } = this.props;

        if (this.validateQuantityInput() == true && this.updateSubscriptionButtonBlock.block == false) {
            this.updateSubscriptionButtonBlock.block = true;
            const { editSelectedSubscription } = this.state;
            this.props.updateSubscription(editSelectedSubscription, this.updateSubscriptionButtonBlock, setStateEditSubscriptionModalIsOpen);
        }
    }



    // Load - Subscription ============================================================================================================= 
    loadData = () => {
        const { subscription, editSubscriptionModalIsOpen } = this.props;
        if (editSubscriptionModalIsOpen === true) {
            this.setState({ editSelectedSubscription: subscription });
        }
    }


    quantitytInputRef = React.createRef();
    quantityErrorMsgP = React.createRef();

    validateQuantityInput = () => {
        let value = this.quantitytInputRef.current.value;
        if (value && value.trim() !== '') {
            let isInt = +value;
            if (isNaN(isInt) !== true && isInt !== 0) {
                this.quantitytInputRef.current.style.backgroundColor = colorWhite;
                return true;
            }
            this.timeOutQuantityErrorMessage();
            this.quantitytInputRef.current.style.backgroundColor = colorRed;
            return false;
        }
    }



    timeOutQuantityErrorMessage = () => {
        this.quantityErrorMsgP.current.hidden = false;
        setTimeout(() => { if (this.quantityErrorMsgP.current !== null) this.quantityErrorMsgP.current.hidden = true }, 7000);
    }




    // Render =====================================================================================================================================
    render() {
        const { products, subscription, editSubscriptionModalIsOpen, toggleEditSubscriptionModal, customers } = this.props;
        const { editSelectedSubscription } = this.state;

        const customer = customers.find(x => x.customerNumber == subscription.customerId);
        const domains = customer !== undefined ? customer.domains : '';

        if (products[0] == undefined || customer == undefined) {
            return '';
        }



        // Return HTML
        return (

            <>
                {/*Modal - Edit Customer Subscriptions  __________________________________________________________________________________________*/}
                <Modal backdropTransition={{ timeout: 0 }} modalTransition={{ timeout: 0 }} fade={false} isOpen={editSubscriptionModalIsOpen} size="xl" toggle={() => toggleEditSubscriptionModal()}>
                    <ModalHeader toggle={() => toggleEditSubscriptionModal()}><span className="title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faBox} /><FontAwesomeIcon className="fa-lg mr-2 mini-title" icon={faPen} />Rediger abonnement</span>:</ModalHeader>
                    <ModalBody>
                        <h2 className="inline">ID: {editSelectedSubscription.id}</h2>
                        <hr />
                        <div className="d-flex flex-row flex-wrap inline">

                            {/*Subscription ID -------------*/}
                            <div className="mr-4 my-2">
                                <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faHashtag} />Abonnement Id: </p>
                                <input disabled name="id" className="form-control" defaultValue={editSelectedSubscription.id} type="text" />
                            </div>



                            {/*Product -------------*/}
                            <div className="mr-4 my-2">
                                <p className="h6 title mr-2"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faCube} />Product: </p>
                                <select name="productId" defaultValue={editSelectedSubscription.productId} className="form-control" onChange={this.handleChangeSubscription}>
                                    {
                                        products.map((product, index) => {
                                            return <option key={index} value={product.productNumber}>{product.name}</option>
                                        })
                                    }
                                </select>
                            </div>



                            {/*Quantity -------------*/}
                            <div className="mr-4 my-2">
                                <p className="h6 title mr-2"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faAlignJustify} />Antal: </p>
                                <input ref={this.quantitytInputRef} name="quantity" className="form-control" size="2" defaultValue={editSelectedSubscription.quantity} min="1" max="10" maxLength="2" onKeyDown={onlyNumbers} onChange={this.handleChangeSubscription} type="text" />
                            </div>



                            {/*Period -------------*/}
                            <div className="mr-4 my-2">
                                <p className="h6 title mr-2"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faClock} />Periode:</p>
                                <select ref={this.periodTypeInput} name="billingPeriodType" defaultValue={editSelectedSubscription.billingPeriodType} className="form-control" onChange={this.handleChangeSubscription}>
                                    {
                                        billingPeriodArr.map((periodType, index) => {
                                            return <option key={index} value={periodType.key}>{periodType.name}</option>
                                        })
                                    }
                                </select>
                            </div>



                            {/*Last Invoiced  Date -------------*/}
                            {editSelectedSubscription.lastInvoiced !== undefined ?
                                <div className="mr-4 my-2">
                                    <p className="h6 title mr-2"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faCalendarPlus} />Sidts Faktureret: </p>
                                    <input name="lastInvoiced" disabled className="form-control" type="date" defaultValue={editSelectedSubscription.lastInvoiced.slice(0, 10)} />
                                </div> : ''}



                            {/*Domain -------------*/}
                            <div className="mr-4 my-2">
                                <p className="h6 title mr-2"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faGlobe} />Domæne: </p>
                                <select name="domainId" defaultValue={editSelectedSubscription.domainId} className="form-control" onChange={this.handleChangeSubscription}>
                                    {
                                        domains.map((domain, index) => {
                                            return <option key={index} value={domain.id}>{domain.domainName}</option>
                                        })
                                    }
                                </select>
                            </div>



                            {/*Start Date -------------*/}
                            {editSelectedSubscription.periodStartDate !== undefined ? <div className="mr-4 my-2">
                                <p className="h6 title mr-2"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faCalendarCheck} />Start Dato: </p>
                                <input ref={this.periodStartDateInput} name="periodStartDate" onKeyDown={(e) => e.preventDefault()} className="form-control" type="month" defaultValue={editSelectedSubscription.periodStartDate.slice(0, 7)} onChange={this.handleChangeSubscription} />
                            </div> : ''}



                            {/*End Date -------------*/}
                            {editSelectedSubscription.periodStartDate !== undefined ? <div className="mr-4 my-2">
                                <p className="h6 title mr-2"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faCalendarTimes} />Udløbs Dato: </p>
                                <input ref={this.periodEndDateInput} disabled name="periodEndDate" className="form-control" type="month" defaultValue={editSelectedSubscription.periodEndDate.slice(0, 7)} />
                            </div> : ''}

                        </div>
                    </ModalBody>
                    <p ref={this.quantityErrorMsgP} hidden className="text-danger inline font-weight-bold"><FontAwesomeIcon className="fa-lg mr-2" icon={faExclamationTriangle} />Antal skal være et tal og skal være større end 0!</p>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateSubscription}><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faSave} />Opdater Abonnement</Button>{' '}
                    </ModalFooter>
                </Modal>
            </>

        );
    }

}


// Map STATE to Props ==============================================================================================================================
const mapStateToProps = state => ({
    products: state.products.list,
    customers: state.customers.list,
    Users: state.users
});

export default connect(mapStateToProps, {
    updateSubscription
})(EditSubscriptionsModal);










