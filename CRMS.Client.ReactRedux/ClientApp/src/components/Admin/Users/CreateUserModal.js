import { faUser, faUserShield, faUserTie, faUserPlus, faTrashAlt, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { registerUser } from '../../../actions/adminActions';
import { editAndDeleteButtonHtml } from '../../../Definitions/commonDefinitions';
import { validateUserEditInput } from '../../../Logic/adminLogic';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Table from '../../common/Table';
import { getUnassaignedRolesForUser, validateUser } from '../../../Logic/usersLogic';
import UserFields from './UserFields';
import { MESSAGE_TYPE } from '../../../actions/types';
import * as moment from 'moment';
import store from '../../../store';




class CreateUserModal extends Component {

    state = {
        userToAdd: { firstName: "", email: "", password: "", phoneNumber: "" }
    }


    // Used for removing typed text on modal close
    componentWillReceiveProps() {
        const { createUserModalIsOpen } = this.props;
        if (createUserModalIsOpen == false) {
            this.userToAddSetState();
        }
    }




    handleChangeUser = (e) => {
        const { userToAdd } = this.state;
        validateUser(this.currentFormAddUserRef);
        let user = { ...userToAdd };
        user[e.currentTarget.name] = e.currentTarget.value;
        this.setState({ userToAdd: user });
    }



    addUserButtonBlock = { block: false };
    currentFormAddUserRef = React.createRef();

    createUser = (e) => {
        const { registerUser, setModalState } = this.props;
        const { userToAdd } = this.state;
        e.preventDefault();
        if (validateUser(this.currentFormAddUserRef) == true && this.addUserButtonBlock.block == false) {
            // Dispatch - Loading -------------------------
            store.dispatch({
                type: MESSAGE_TYPE,
                payload:
                {
                    messageType: 'loading',
                    messageContent: `Opretter bruger med Email: ${userToAdd.email} - Vent venligst!`,
                    time: moment().add(3, 'seconds').valueOf()
                }
            });
            this.addUserButtonBlock.block = true;
            registerUser(userToAdd, this.userToAddSetState, this.addUserButtonBlock, setModalState);
        }
    }



    userToAddSetState = () => {
        let emptyUser = { firstName: "", email: "", password: "", phoneNumber: "" };
        this.setState({ userToAdd: emptyUser });
    }





    // Render ===================================================================================================================================================
    render() {
        const { createUserModalIsOpen, toggleCreateUserModal, selectedUser, allRoles, updateUser, addUserToRole } = this.props;
        const { userToAdd } = this.state;

        return (
            <>
                {/*Modal - Add Customer Contact Person _________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________*/}
                <Modal backdropTransition={{ timeout: 0 }} modalTransition={{ timeout: 0 }} fade={false} isOpen={createUserModalIsOpen} size="xl" toggle={toggleCreateUserModal}>
                    <ModalHeader toggle={toggleCreateUserModal}><span className="title"><FontAwesomeIcon className="fa-lg mr-2" icon={faUserPlus} />Opret Bruger</span>:</ModalHeader>
                    <ModalBody>
                        <h2 className="inline">&nbsp;{userToAdd.firstName}</h2>
                        <form ref={this.currentFormAddUserRef} onSubmit={(e) => this.createUser(e)}>
                            <UserFields handleChange={this.handleChangeUser} user={userToAdd} />
                            {/*Send Button*/}
                            <hr />
                            <div className="inline">
                                <button type="submit" className="btn btn-primary ml-2 mt-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faSave} />Opret Bruger</button>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}
const mapStateToProps = state => ({
    allRoles: state.allRoles.list,
    Users: state.users
});
export default connect(mapStateToProps, { registerUser })(CreateUserModal);




