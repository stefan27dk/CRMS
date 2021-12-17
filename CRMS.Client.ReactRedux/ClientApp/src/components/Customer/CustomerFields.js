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

class CustomerFields extends Component {

    handleChangeCustomer = (e) => {

        //const contact = { ...selectedContact, [e.target.name]: e.target.value }
        const { currentCustomer, setStateCurrentCustomer, customerForm } = this.props;

        validateCustomer(customerForm);

        let customer = {};
        if (e.target.name === 'customerGroup') {
            customer = { ...currentCustomer, ["customerGroup"]: { customerGroupNumber: tryConvertToInt(e.target.value) } }
        }
        else {
            customer = { ...currentCustomer, [e.target.name]: e.target.value }
        }
        setStateCurrentCustomer(customer);
    }




    // Render ===================================================================================================================================================
    render() {
        const { currentCustomer, extraFields } = this.props;
        return (
            <>
                <div className="d-flex flex-row flex-wrap inline">
                    {/*NAME -------------*/}
                    <div className="mr-4 my-2">
                        <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faIdCard} />Navn:* </p>
                        <input name="name" className="form-control" value={currentCustomer.name} onChange={this.handleChangeCustomer} maxLength="50" type="text" />
                    </div>



                    {/*Address -------------*/}
                    <div className="mr-4 my-2">
                        <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faMapMarkerAlt} />Adresse: </p>
                        <input name="address" className="form-control" maxLength="200" value={currentCustomer.address} onChange={this.handleChangeCustomer} type="text" />
                    </div>



                    {/*City -------------*/}
                    <div className="mr-4 my-2">
                        <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faCity} /> By: </p>
                        <input name="city" className="form-control" maxLength="50" value={currentCustomer.city} onKeyDown={onlyLettersAndSpace} onChange={this.handleChangeCustomer} type="text" />
                    </div>



                    {/*Zip -------------*/}
                    <div className="mr-4 my-2">
                        <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faAsterisk} />PostNr: </p>
                        <input name="zip" className="form-control" maxLength="30" value={currentCustomer.zip} onChange={this.handleChangeCustomer} type="text" />
                    </div>



                    {/*Telephone -------------*/}
                    <div className="mr-4 my-2">
                        <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faPhoneSquareAlt} />Telefon: </p>
                        <input name="telephoneAndFaxNumber" className="form-control" maxLength="20" value={currentCustomer.telephoneAndFaxNumber} onKeyDown={noLetters} onChange={this.handleChangeCustomer} type="text" />
                    </div>



                    {/*Email -------------*/}
                    <div className="mr-4 my-2">
                        <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faAt} />Email: </p>
                        <input name="email" className="form-control" maxLength="200" value={currentCustomer.email} onChange={this.handleChangeCustomer} type="text" />
                    </div>




                    {/*Customer Group -------------*/}
                    <div className="mr-4 my-2">
                        <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faLayerGroup} />Kundegruppe:* </p>
                        <input name="customerGroup" className="form-control" maxLength="20" defaultValue="1" onKeyDown={onlyNumbers} onChange={this.handleChangeCustomer} type="text" />
                    </div>



                    {/*Customer CVR -------------*/}
                    <div className="mr-4 my-2">
                        <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faHashtag} /> CVR: </p>
                        <input name="corporateIdentificationNumber" className="form-control" value={currentCustomer.corporateIdentificationNumber} maxLength="20" onChange={this.handleChangeCustomer} type="text" />
                    </div>



                    {/*Country -------------*/}
                    <div className="mr-4 my-2">
                        <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faFlag} />Land: </p>
                        <input name="country" className="form-control" maxLength="50" onKeyDown={onlyLettersAndSpace} defaultValue="Danmark" onChange={this.handleChangeCustomer} type="text" />
                    </div>



                    {/*MaxCredit -------------*/}
                    {/*<div className="mr-4 my-2">*/}
                    {/*    <p className="h6 title">Kreditmaksimum: </p>*/}
                    {/*    <input name="creditLimit" maxLength="9" className="input" onKeyDown={onlyNumbers} onChange={this.handleChangeAddCustomer} type="text" />*/}
                    {/*</div>*/}



                    {/*Website -------------*/}
                    <div className="mr-4 my-2">
                        <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faGlobeAfrica} />Hjemmeside: </p>
                        <input name="website" className="form-control" value={currentCustomer.website !== null || currentCustomer.website !== undefined ? currentCustomer.website : ''} onChange={this.handleChangeCustomer} type="text" />
                    </div>


                    {/*Currency -------------*/}
                    <div className="mr-4 my-2">
                        <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faMoneyBillWaveAlt} />Valuta:* </p>
                        <input name="currency" className="form-control" defaultValue="DKK" onChange={this.handleChangeCustomer} type="text" />
                    </div>


                    {extraFields == false ? '' : <>

                        {/*Company - Type -------------*/}
                        <div className="mr-4 mt-16px">
                            <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faQuoteLeft} />Firma Type: </p>
                            <input readOnly name="industrydesc" className="form-control grey-background" defaultValue={currentCustomer.industrydesc} type="text" />
                            <p className="font-size-10 text-primary font-weight-bold ml-2 mt-1px mb-0">Er ikke gemt i e-conomic</p>
                        </div>



                        {/*Company - Indistry Code -------------*/}
                        <div className="mr-4 my-2">
                            <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faIndustry} />Firma Indistrikode: </p>
                            <input readOnly name="industrycode" className="form-control grey-background" defaultValue={currentCustomer.industrycode} type="text" />
                            <p className="font-size-10 text-primary font-weight-bold ml-2 mt-1px">Er ikke gemt i e-conomic</p>
                        </div>



                        {/*Company - Indistry Code -------------*/}
                        <div className="mr-4 my-2">
                            <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faIndent} />Selskabsform:</p>
                            <input readOnly name="companydesc" className="form-control grey-background" defaultValue={currentCustomer.companydesc} type="text" />
                            <p className="font-size-10 text-primary font-weight-bold ml-2 mt-1px">Er ikke gemt i e-conomic</p>
                        </div>



                        {/*Company - Created Date -------------*/}
                        <div className="mr-4 my-2">
                            <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faCalendarAlt} />Virk. Oprets Dato:</p>
                            <input readOnly name="startdate" className="form-control grey-background" defaultValue={currentCustomer.startdate} type="text" />
                            <p className="font-size-10 text-primary font-weight-bold ml-2 mt-1px">Er ikke gemt i e-conomic</p>
                        </div>  </>}
                </div>

            </>
        );
    }
}
const mapStateToProps = state => ({
    Users: state.users
});
export default connect(mapStateToProps)(CustomerFields);




