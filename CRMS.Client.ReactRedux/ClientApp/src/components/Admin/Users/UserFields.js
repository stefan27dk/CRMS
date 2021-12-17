import { faUser, faUserShield, faUserTie, faUserPlus, faTrashAlt, faIdCard, faAt, faKey, faPhoneSquareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { registerUser } from '../../../actions/adminActions';
import { editAndDeleteButtonHtml } from '../../../Definitions/commonDefinitions';
import { validateUserEditInput } from '../../../Logic/adminLogic';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Table from '../../common/Table';
import { getUnassaignedRolesForUser } from '../../../Logic/usersLogic';
import { onlyLetters } from '../../../Logic/validationLogic';




class UserFields extends Component {

    // Render ===================================================================================================================================================
    render() {
        const { handleChange, user, submitButtonText } = this.props;
        return (
            <div className="d-flex flex-row flex-wrap inline">
                {/* User FirstName -------------*/}
                <div className="mr-4 my-2">
                    <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2" icon={faIdCard} />Navn: </p>
                    {/*<input name="name" className="input" value={selectedUser.name} onChange={this.handleChangeAddContact} type="text" />*/}
                    <input name="firstName" className="form-control" value={user.firstName} onKeyDown={onlyLetters} onChange={handleChange} type="text" />
                    <p className="font-size-10 text-warning font-weight-bold ml-2">Min 2 bogstaver eller ingen*</p>
                </div>

                {/*User Email -------------*/}
                <div className="mr-4 my-2">
                    <p className="h6 title mr-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faAt} />Email: </p>
                    <input id="selectedUserEmail" name="email" className="form-control" value={user.email} onChange={handleChange} type="text" />
                    <p className="font-size-10 text-warning font-weight-bold ml-1">Påkrævet - Kun Valid formateret email*</p>
                </div>


                {/*Password -------------*/}
                <div className="mr-4 my-2">
                    <p className="h6 title mr-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faKey} />Adgangskode: </p>
                    <input id="selectedUserPassword" name="password" className="form-control" value={user.password} placeholder="Ny Adgangskode..." onChange={handleChange} type="text" />
                    <p className="font-size-10 text-warning font-weight-bold ml-2">Påkrævet - Min 6 tegn*</p>
                </div>


                {/* User Phone -------------*/}
                <div className="mr-4 my-2">
                    <p className="h6 title mr-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faPhoneSquareAlt} />Telefon: </p>
                    <input id="selectedUserPhone" name="phoneNumber" className="form-control" value={user.phoneNumber} onChange={handleChange} type="text" />
                    <p className="font-size-10 text-warning font-weight-bold ml-2">Min/Max 8 tal eller ingen*</p>
                </div>

            </div>
        );
    }
}
export default UserFields;




