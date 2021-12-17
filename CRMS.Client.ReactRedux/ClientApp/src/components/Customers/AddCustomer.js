import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { noLetters, onlyLettersAndSpace, onlyNumbers, tryConvertToInt } from '../../Logic/validationLogic';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { fetchDataFromCvrApi } from '../../actions/customersActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk, faAt, faCalendarAlt, faCity, faExclamationTriangle, faFlag, faGlobeAfrica, faHashtag, faIdCard, faIndent, faIndustry, faLayerGroup, faMapMarkerAlt, faMoneyBillWaveAlt, faPhoneSquareAlt, faQuoteLeft, faSave, faSearch, faTimesCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { defaultNewcustomer } from '../../Definitions/customersDefinitions';
import { validateCustomer } from '../../Logic/customersLogic';
import store from '../../store';
import { MESSAGE_TYPE } from '../../actions/types';
import * as moment from 'moment';
import CustomerFields from '../Customer/CustomerFields';

class AddCustomer extends Component {
    searchCustomerInput = React.createRef();
    searchCustomerErrorP = React.createRef();
    customerAddForm = React.createRef();

    blockAddCustomerButton = { block: false };

    fetchCustomerDataFromCvrApi = () => {
        const { cvrApiAddress, fetchDataFromCvrApi } = this.props;
        this.searchCustomerErrorP.current.innerHTML = "";

        if (this.searchCustomerInput.current.value !== "") {
            let cvrApiUrl = cvrApiAddress + '/api?search=' + this.searchCustomerInput.current.value + '&country=dk';
            fetchDataFromCvrApi(cvrApiUrl, this.populateCustomer);
        }
    }


    populateCustomer = (customerData) => {
        const { setStateNewCustomer } = this.props;

        if (customerData.error == undefined) {
            let newCustomerData = {
                ...defaultNewcustomer,
                name: customerData.name == undefined || customerData.name == null ? '' : customerData.name,
                address: customerData.address == undefined || customerData.address == null ? '' : customerData.address,
                zip: customerData.zipcode == undefined || customerData.zipcode == null ? '' : customerData.zipcode,
                city: customerData.city == undefined || customerData.city == null ? '' : customerData.city,
                telephoneAndFaxNumber: customerData.phone == undefined || customerData.phone == null ? '' : customerData.phone,
                email: customerData.email == undefined || customerData.email == null ? '' : customerData.email,
                corporateIdentificationNumber: customerData.vat !== undefined ? customerData.vat.toString() : '',
                industrydesc: customerData.industrydesc == undefined || customerData.industrydesc == null ? '' : customerData.industrydesc,
                industrycode: customerData.industrycode == undefined || customerData.industrycode == null ? '' : customerData.industrycode,
                companydesc: customerData.companydesc == undefined || customerData.companydesc == null ? '' : customerData.companydesc,
                startdate: customerData.startdate == undefined || customerData.startdate == null ? '' : customerData.startdate
            };

            setStateNewCustomer(newCustomerData);
            validateCustomer(this.customerAddForm);
        }
        else {
            this.searchCustomerErrorP.current.innerHTML = `CVR API - Fejl Besked - ${customerData.message}!`;
        }
    }





    addCustomerSend = (event) => {
        event.preventDefault();
        const { addNewCustomer } = this.props;


        if (validateCustomer(this.customerAddForm) == true && this.blockAddCustomerButton.block == false) {
            // Dispatch - Loading -------------------------
            store.dispatch({
                type: MESSAGE_TYPE,
                payload:
                {
                    messageType: 'loading',
                    messageContent: `Opretter Kunde: ${addNewCustomer.name} - Vent venligst!`,
                    time: moment().add(3, 'seconds').valueOf()
                }
            });
            this.blockAddCustomerButton.block = true;
            addNewCustomer(this.blockAddCustomerButton);
        }
    }




    //handleChangeAddCustomer = (e) => {

    //    //const contact = { ...selectedContact, [e.target.name]: e.target.value }
    //    const { newCustomer, setStateNewCustomer } = this.props;

    //    validateCustomer(this.customerAddForm);
    //   /* e.target.style.backgroundColor = "white";*/

    //    let customer = {};
    //    if (e.target.name === 'customerGroup') {
    //        customer = { ...newCustomer, ["customerGroup"]: { customerGroupNumber: tryConvertToInt(e.target.value) } }
    //    }
    //    else {
    //        customer = { ...newCustomer, [e.target.name]: e.target.value }
    //    }

    //    setStateNewCustomer(customer);
    //}




    // Render ===================================================================================================================================================
    render() {
        const { toggleAddCustomerModal, newCustomer, openAddCustomerModal, addNewCustomer, setStateNewCustomer } = this.props;
        return (
            <>
                {/*ADD CUSTOMER */}
                {/*Modal - Add Customer __________________________________________________________________________________________*/}
                <Modal backdropTransition={{ timeout: 0 }} modalTransition={{ timeout: 0 }} fade={false} isOpen={openAddCustomerModal} size="xl" toggle={toggleAddCustomerModal}>

                    <form ref={this.customerAddForm} name="addCustomerForm" onSubmit={(e) => this.addCustomerSend(e)}>
                        <ModalHeader toggle={toggleAddCustomerModal}><span className="title"><FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faUserPlus} />Opret Ny Kunde</span>:</ModalHeader>
                        <ModalBody>

                            {/*Customer Name or CVR SEARCH -------------*/}
                            <div>

                                <div className="inline">
                                    <div>
                                        <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2" icon={faSearch} />Søg Kunde: </p>
                                        <div className="inline">
                                            <input ref={this.searchCustomerInput} name="search-customer" placeholder="Søg kunde Navn eller CVR..." className="form-control search-input-cvr" maxLength="50" onKeyPress={(event) => { if (event.key === "Enter") { this.fetchCustomerDataFromCvrApi() } }} type="text" />
                                            <span onClick={() => this.searchCustomerInput.current.value = ""} className="red-t no-select m-t-b-auto ml-2 "><FontAwesomeIcon className="fa-lg mr-2" icon={faTimesCircle} /></span>
                                            <Button color="btn btn-primary text-nowrap ml-2" onClick={() => this.fetchCustomerDataFromCvrApi()}><FontAwesomeIcon className="fa-lg ml-2 mr-2" icon={faSearch} /></Button>
                                        </div>
                                        <div>
                                            <span className="font-size-10 text-danger font-weight-bold ml-2">Søg Max 50 gange pr. dag! - <u><a href="https://cvrapi.dk" target="_blank">CVR-API</a></u></span>
                                        </div>
                                    </div>
                                </div>
                                <p className="font-weight-bold text-danger" ref={this.searchCustomerErrorP}></p>
                            </div>

                            <hr />

                            <h2 className="inline">{newCustomer.name}&nbsp;</h2>

                            <hr />
                            <CustomerFields currentCustomer={newCustomer} customerForm={this.customerAddForm} setStateCurrentCustomer={setStateNewCustomer} />

                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit"><FontAwesomeIcon className="fa-lg mr-2 ml-1 mb-1" icon={faSave} />Opret Kunde</Button>{' '}
                        </ModalFooter>
                    </form>
                </Modal>
            </>
        );
    }
}
const mapStateToProps = state => ({
    Users: state.users,
    cvrApiAddress: state.cvrApiAddress.item
});
export default connect(mapStateToProps, { fetchDataFromCvrApi })(AddCustomer);




