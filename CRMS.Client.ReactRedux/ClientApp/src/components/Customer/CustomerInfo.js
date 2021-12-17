import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit, faUserEdit, faPen, faUserPlus, faPenSquare, faPencilAlt, faTrash, faSave, faRedoAlt, faUndoAlt, faPhoneSquareAlt, faAt, faStickyNote, faIdCard, faToolbox, faInfoCircle, faLayerGroup, faHashtag, faGlobeAfrica, faGlobe, faMapMarkedAlt, faMapMarkerAlt, faAsterisk, faIdBadge, faPlus } from '@fortawesome/free-solid-svg-icons'
import { noLetters, onlyLettersAndSpace, onlyNumbers, tryConvertToInt } from '../../Logic/validationLogic';
import Table from '../common/Table';
import ReactDOMServer from 'react-dom/server';
import CustomerDomainModal from './CustomerDomainModal';
import { deleteCustomer } from '../../actions/customerActions';
import { MESSAGE_TYPE } from '../../actions/types';
import * as moment from 'moment';
import store from '../../store';
import CustomerFields from './CustomerFields';
import { validateCustomer, validateCustomerContactPerson } from '../../Logic/customersLogic';
import CustomerContactPersonFields from './CustomerContactPersonFields';

// Class #################################################################################################################################
class CustomerInfo extends Component {

    contactPersonColumns = [
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faIdCard} />NAVN</>, path: "name" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faPhoneSquareAlt} />TELEFON</>, path: "phone" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faAt} />E-MAIL</>, path: "email" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faStickyNote} />KOMENTAR</>, path: "notes" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faToolbox} />FUNKTIONER</>, content: (data) => this.contactPersonFunctions(data) }];

    customerEditForm = React.createRef();
    blockEditCustomerButton = { block: false };


    contactPersonFunctions = (data) => {
        return <><span className="no-select button-yellow no-wrap"
            onClick={() => this.editContact(data)}>REDIGER<FontAwesomeIcon
                className="fa-lg ml-3 mr-2" icon={faPen} /></span> | <span onClick={() => this.deleteContact(data)} className="no-select red-t no-wrap">SLET<FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faTrashAlt} /></span></>;
    }



    state = {
        domainModal: false, editContactsModal: false, addContactModal: false, editCustomerModal: false, selectedContact: {},
        editCustomer: { website: '', country: 'Danmark' }, addBuildContact: {}
    }
    //domainInput = React.createRef(); // Ref for the domain input


    // Delete Customer
    deleteCustomer = () => {
        const { customer, deleteCustomer, history, subscriptions } = this.props;

        let subscription = subscriptions.find(s => s.customerId == customer.customerNumber);
        if (subscription !== undefined) {
            store.dispatch(
                {
                    type: MESSAGE_TYPE,
                    payload:
                    {
                        messageType: 'warning',
                        messageContent: `Kunde med Navn: ${customer.name} kan ikke slettes fordi den kunde har abonnementer - SLET abonnementer først!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                }
            );
        }
        else if (customer.domains.length > 0) {
            store.dispatch(
                {
                    type: MESSAGE_TYPE,
                    payload:
                    {
                        messageType: 'warning',
                        messageContent: `Kunde med Navn: ${customer.name} kan ikke slettes fordi den kunde har domæner - SLET domæner først!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                }
            );
        }
        else {
            let result = window.confirm(`Vil du slette Kunde - ${customer.name}?`);
            if (result) {
                deleteCustomer(customer.customerNumber, history);
            }
        }
    }



    // Customer Information ============================================================================================================= 
    renderCustomerInfoSection = () => {
        const { customer, customerContactPersons } = this.props;
        return (
            <>
                {/*Info Container*/}
                <div className="info-container">
                    <div className="title-t">
                        <span className="h4 autoResizeFont-big"><FontAwesomeIcon className="fa-lg mr-2" icon={faInfoCircle} />KUNDEINFORMATION </span>
                        <span onClick={this.toggleEditCustomerModal} className="ico-dark right-icon no-select mr-5 ml-2">Rediger Kunde<FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faUserEdit} /></span>
                        <CustomerDomainModal customer={customer} />
                        <span onClick={this.deleteCustomer} className="ico-dark right-icon no-select mr-5">Slet Kunde<FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faTrashAlt} /></span>
                    </div>



                    {/*Top Container - Info   */}
                    {/*<br/>*/}
                    <div className="info-top-container subDiv">


                        {/*Customer - Info - Name, Address etc.*/}
                        <div className="p-2 inline-block">
                            <p className="bo-500  my-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faIdCard} />{customer.name !== undefined ? customer.name : ''}</p>
                            <p className="my-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faMapMarkerAlt} />{customer.address !== undefined ? customer.address : ''}</p>
                            <p className="my-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faAsterisk} />{customer.zip !== undefined ? customer.zip : '' + " " + customer.city !== undefined ? customer.city : ''}</p>
                        </div>



                        {/*Customer - TLF - Mail, CVR*/}
                        <div className="p-2 inline-block">
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faAt} />{"FAKTURERINGSMAIL:"}</p><p className="no-wrap m-0">{customer.email}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faHashtag} />CVR:</p><p className="no-wrap">{customer.corporateIdentificationNumber}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faPhoneSquareAlt} />{"TELEFON:"}</p><p className="no-wrap">{customer.telephoneAndFaxNumber}</p></div>
                        </div>




                        {/*KundeGruppe*/}
                        <div className="p-2 inline-block">
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faLayerGroup} />KUNDEGRUPPE:</p><p className="no-wrap m-0">{customer.customerGroup !== undefined ? customer.customerGroup.customerGroupNumber : ''}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faHashtag} />KUNDE ID:</p><p className="no-wrap m-0">{customer.customerNumber}</p></div>
                            {customer.website !== undefined ? <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faGlobeAfrica} />{"KUNDE HJEMMESIDE:"}</p><a className="no-wrap m-0" href={"http://" + customer.website} target="_blank">{customer.website}</a></div> : ''}
                        </div>



                        {/*Customer - Domains*/}
                        <div className="p-2 inline-block">
                            <p className="m-0 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faGlobe} />{"DOMÆNER:"}</p>

                            {customer.domains.map((domain, index) => {
                                return <li key={"domainInfo" + domain.id} className="m-0"><a href={"http://" + domain.domainName} target="_blank">{domain.domainName}</a></li>;
                            })}
                        </div>

                    </div>


                    {/*KontaktPersoner*/}
                    <div className="table-container table-responsive subDiv">
                        <div className="title-t mt-2">
                            <span onClick={this.toggleAddContactModal} className="ico-dark right-icon no-select mr-5">Tilføj Kontaktperson<FontAwesomeIcon className="fa-lg ml-3 mini-title" icon={faPlus} /><FontAwesomeIcon className="fa-lg ml-1" icon={faIdBadge} /></span>
                        </div>
                        <Table className="my-5" tableColumns={this.contactPersonColumns} tableData={customerContactPersons} tableTitle="KONTAKT PERSONER" tableIcon={<span><FontAwesomeIcon className="fa-lg mr-4" icon={faIdBadge} />KONTAKT PERSONER</span>} tableContainerClass={'table-holder-h-fit'} tableId={'contactPersonTable'} excelFilter={'removeLastColumn'} />
                    </div>
                </div>
            </>
        );
    }







    // ADD - CONTACT PERSON ##################################################################################################################################################################################################################################
    // Add - Customer Contact - Modal Toggle - Show / Hide ============================================================================================
    toggleAddContactModal = () => {
        this.setState({
            addContactModal: !this.state.addContactModal, addBuildContact: {}
        });
    }








    blockAddContactPersonButton = { block: false }

    // Update ContactPerson ============================================================================================================= 
    sendAddContact = (event) => {
        //State
        const { addBuildContact } = this.state;
        // Props
        const { customer, addCustomerContactPerson } = this.props;

        event.preventDefault();

        if (validateCustomerContactPerson(this.addBuildContactForm) == true && this.blockAddContactPersonButton.block == false) {
            // Dispatch - Loading -------------------------
            store.dispatch({
                type: MESSAGE_TYPE,
                payload:
                {
                    messageType: 'loading',
                    messageContent: `Opretter Kunde Kontaktperson: ${addBuildContact.name} - Vent venligst!`,
                    time: moment().add(3, 'seconds').valueOf()
                }
            });

            this.blockAddContactPersonButton.block = true;
            // Send
            addCustomerContactPerson(customer.customerNumber, addBuildContact, this.blockAddContactPersonButton, this.setStateAddContactModal);
        }
    }



    setStateAddContactModal = (bool) => {
        this.setState({ addContactModal: bool });
    }


    // EDIT CONTACT PERSON ##################################################################################################################################################################################################################################
    // Customer Contacts - Modal Toggle - Show / Hide ============================================================================================
    toggleEditContactsModal = () => {
        this.setState({
            editContactsModal: !this.state.editContactsModal
        });
    }






    editContact = (contact) => {
        this.toggleEditContactsModal();
        this.setState({ selectedContact: contact });
    }





    // Delete Contact Person ============================================================================================================= 
    deleteContact = (contact) => {
        let result = window.confirm(`Vil du slette kontaktperson - ${contact.name} ?`);
        if (result) {
            const { customer, deleteCustomerContactPerson } = this.props;
            deleteCustomerContactPerson(customer.customerNumber, contact.customerContactNumber);
        }
    }








    setStatEeditContactsModal = (bool) => {
        this.setState({ editContactsModal: bool });
    }

    blockUpdateContactPersonButton = { block: false };

    // Update ContactPerson ============================================================================================================= 
    updateContactPerson = (event) => {
        const { selectedContact } = this.state;
        const { customer, updateCustomerContactPersons } = this.props;

        event.preventDefault();

        if (validateCustomerContactPerson(this.selectedContactForm) == true && this.blockUpdateContactPersonButton.block == false) {
            // Dispatch - Loading -------------------------
            store.dispatch({
                type: MESSAGE_TYPE,
                payload:
                {
                    messageType: 'loading',
                    messageContent: `Opdater Kunde Kontaktperson: ${selectedContact.name} - Vent venligst!`,
                    time: moment().add(3, 'seconds').valueOf()
                }
            });

            this.blockUpdateContactPersonButton.block = true;
            // Send
            updateCustomerContactPersons(customer.customerNumber, selectedContact, this.blockUpdateContactPersonButton, this.setStatEeditContactsModal);
        }


        //this.toggleEditContactsModal();
    }




    // Edit Customer ##################################################################################################################################################################################################################################
    // Edit Customer - Modal Toggle - Show / Hide ============================================================================================
    toggleEditCustomerModal = () => {
        this.setState({
            editCustomerModal: !this.state.editCustomerModal, editCustomer: this.props.customer
        });
    }




    // Update Customer - Send  ============================================================================================
    editCustomerSend = (event) => {
        event.preventDefault();
        const { editCustomer } = this.state;
        const { customer, updateCustomer } = this.props;



        if (validateCustomer(this.customerEditForm) == true && this.blockEditCustomerButton.block == false) {
            // Dispatch - Loading -------------------------
            store.dispatch({
                type: MESSAGE_TYPE,
                payload:
                {
                    messageType: 'loading',
                    messageContent: `Opdater Kunde: ${editCustomer.name} - Vent venligst!`,
                    time: moment().add(3, 'seconds').valueOf()
                }
            });

            this.blockEditCustomerButton.block = true;
            let customerToEdit = { ...editCustomer };
            if (customerToEdit.website == null) {
                customerToEdit.website = "";
            }
            if (customerToEdit.country == null) {
                customerToEdit.country = "Danmark";
            }
            updateCustomer(customerToEdit, customer.customerNumber, this.blockEditCustomerButton, this.setStateEditCustomerModal);
        }

    }


    setStateEditCustomerModal = (bool) => {
        this.setState({ editCustomerModal: bool });
    }

    setStateEditCustomer = (editCustomerObj) => {
        this.setState({ editCustomer: editCustomerObj });
    }






    setStateAddBuildContact = (contactObj) => {
        this.setState({ addBuildContact: contactObj });
    }


    addBuildContactForm = React.createRef();
    selectedContactForm = React.createRef();




    setStateSelectedContact = (contactObj) => {
        this.setState({ selectedContact: contactObj });
    }

    // Render ===================================================================================================================
    render() {

        const { domainModal, editContactsModal, editCustomerModal, selectedContact, editCustomer, addContactModal, addBuildContact } = this.state;
        const { customer, domains } = this.props;
        if (customer == undefined) { return <p>...</p> }

        return (
            <>

                {/*Modal - Edit Customer __________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________*/}
                <Modal backdropTransition={{ timeout: 0 }} modalTransition={{ timeout: 0 }} fade={false} isOpen={editCustomerModal} size="xl" toggle={this.toggleEditCustomerModal}>
                    <form ref={this.customerEditForm} name="editCustomerForm" onSubmit={(e) => this.editCustomerSend(e)}>
                        <ModalHeader toggle={this.toggleEditCustomerModal}><span className="title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faUserEdit} />Rediger Kunde:</span></ModalHeader>
                        <ModalBody>
                            <h2 className="inline">{editCustomer.name}</h2>
                            <hr />
                            <CustomerFields currentCustomer={editCustomer} customerForm={this.customerEditForm} setStateCurrentCustomer={this.setStateEditCustomer} extraFields={false} />

                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit" ><FontAwesomeIcon className="fa-lg mr-2" icon={faSave} />Opdater Kunde</Button>{' '}
                        </ModalFooter>
                    </form>
                </Modal>








                {/*Modal - Add Customer Contact Person _________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________*/}
                <Modal backdropTransition={{ timeout: 0 }} modalTransition={{ timeout: 0 }} fade={false} isOpen={addContactModal} size="xl" toggle={this.toggleAddContactModal}>
                    <form ref={this.addBuildContactForm} name="addContactForm" onSubmit={(e) => this.sendAddContact(e)}>
                        <ModalHeader toggle={this.toggleAddContactModal}><span className="title"><FontAwesomeIcon className="fa-lg ml-3 mini-title" icon={faPlus} /><FontAwesomeIcon className="fa-lg ml-1 mr-3" icon={faIdBadge} />Tilføj Kontaktperson</span>:</ModalHeader>
                        <ModalBody>
                            <h2 className="inline">&nbsp;{addBuildContact.name}</h2>
                            <hr />
                            <CustomerContactPersonFields currentContact={addBuildContact} setStateCurrentContact={this.setStateAddBuildContact} currentContactForm={this.addBuildContactForm} />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faSave} />Opret</Button>{' '}
                        </ModalFooter>
                    </form>
                </Modal>











                {/*Modal - Edit Customer Contact Persons _________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________*/}
                <Modal backdropTransition={{ timeout: 0 }} modalTransition={{ timeout: 0 }} fade={false} isOpen={editContactsModal} size="xl" toggle={this.toggleEditContactsModal}>
                    <form ref={this.selectedContactForm} name="selectedContactForm" onSubmit={(e) => this.updateContactPerson(e)}>
                        <ModalHeader toggle={this.toggleEditContactsModal}><span className="title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faUserEdit} />Rediger Kontaktperson:</span></ModalHeader>
                        <ModalBody>
                            <h2 className="inline">&nbsp;{selectedContact.name}</h2>
                            <hr />
                            <CustomerContactPersonFields currentContact={selectedContact} setStateCurrentContact={this.setStateSelectedContact} currentContactForm={this.selectedContactForm} />
                        </ModalBody>

                        <ModalFooter>
                            <Button color="primary" type="submit"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faSave} />Opdater Kontaktperson</Button>{' '}
                        </ModalFooter>
                    </form>
                </Modal>



                {/*CUSTOMER INFO*/}
                {this.renderCustomerInfoSection()}

            </>
        );
    }
}

export default CustomerInfo;



