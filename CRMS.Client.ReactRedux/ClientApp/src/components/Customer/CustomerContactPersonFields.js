import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit, faUserEdit, faPen, faUserPlus, faPenSquare, faPencilAlt, faTrash, faSave, faRedoAlt, faUndoAlt, faPhoneSquareAlt, faIdCard, faAt, faStickyNote } from '@fortawesome/free-solid-svg-icons'
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

// Class #################################################################################################################################
class CustomerContactPersonFields extends Component {



    // Input Handle Change CustomerContacts ============================================================================================================= 
    handleChangeContact = (e) => {
        const { currentContact, setStateCurrentContact, currentContactForm } = this.props;

        validateCustomerContactPerson(currentContactForm);

        const contact = { ...currentContact, [e.target.name]: e.target.value }
        setStateCurrentContact(contact);
    }



    // Render ===================================================================================================================
    render() {

        const { currentContact } = this.props;
        return (
            <>
                <div className="d-flex flex-row flex-wrap inline">

                    {/* Contact Name -------------*/}
                    <div className="mr-4 my-3">
                        <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faIdCard} />Navn: </p>
                        <input name="name" className="form-control" value={currentContact.name} onChange={this.handleChangeContact} type="text" />
                    </div>


                    {/* Contact Phone -------------*/}
                    <div className="mr-4 my-3">
                        <p className="h6 title mr-2"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faPhoneSquareAlt} />Telefon: </p>
                        <input name="phone" className="form-control" value={currentContact.phone} onChange={this.handleChangeContact} type="text" />
                    </div>


                    {/* Contact Email -------------*/}
                    <div className="mr-4 my-3">
                        <p className="h6 title mr-2"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faAt} />Email: </p>
                        <input name="email" className="form-control" value={currentContact.email} onChange={this.handleChangeContact} type="text" />
                    </div>



                    {/* Contact Notes -------------*/}
                    <div className="mr-4 my-3">
                        <p className="h6 title mr-2"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faStickyNote} />Komentarer: </p>
                        <input name="notes" className="form-control" value={currentContact.notes} onChange={this.handleChangeContact} type="text" />
                    </div>

                </div>
            </>
        );
    }
}

export default CustomerContactPersonFields;



