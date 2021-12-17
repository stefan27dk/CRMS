import { faUser, faUserShield, faUserTie, faUserPlus, faTrashAlt, faSave, faUserTag, faPlus, faExclamationTriangle, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { deleteUserRole, fetchAllRoles, updateUser, fetchUsersWithRoles, addUserToRole } from '../../../actions/adminActions';
import { editAndDeleteButtonHtml } from '../../../Definitions/commonDefinitions';
import { validateUserEditInput } from '../../../Logic/adminLogic';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Table from '../../common/Table';
import { getUnassaignedRolesForUser, validateUser } from '../../../Logic/usersLogic';
import UserFields from './UserFields';
import { MESSAGE_TYPE } from '../../../actions/types';
import * as moment from 'moment';
import store from '../../../store';




class UserEditModal extends Component {
    addRoleDropDown = React.createRef();
    state = { selectedRoleDropBox: '' }

    // On Modal close reset value
    componentWillReceiveProps() {
        const { isOpen } = this.props;
        if (isOpen == false) {
            this.setState({ selectedRoleDropBox: '' });
        }
    }


    componentDidUpdate() {
        const { allRoles, selectedUser } = this.props;
        const { selectedRoleDropBox } = this.state;

        // Set Initial Value of state
        if (selectedRoleDropBox == '') {
            let filteredRoles = getUnassaignedRolesForUser(allRoles, selectedUser.roles);
            if (filteredRoles[0] !== undefined) {
                this.setState({ selectedRoleDropBox: filteredRoles[0].name });
            }
        }
    }


    currentFormRef = React.createRef();


    handleOnchangeEditUser = (e) => {
        const { setSelectedUserState, selectedUser } = this.props;
        const user = { ...selectedUser, [e.target.name]: e.target.value }
        validateUser(this.currentFormRef);
        setSelectedUserState(user);
    }


    deleteUserRoleSend = (userEmail, roleName) => {
        const { selectedUser, setSelectedUserState } = this.props;
        this.props.deleteUserRole(userEmail, roleName, setSelectedUserState, selectedUser, this.setStateOfAddRoleDropDown, this.addRoleDropDown);
    }


    updateUserButtonBlock = { block: false };

    updateUserSend = (e, userToEdit) => {
        e.preventDefault();
        const { updateUser, setModalState } = this.props;

        if (validateUser(this.currentFormRef) == true && this.updateUserButtonBlock.block == false) {
            // Dispatch - Loading -------------------------
            store.dispatch({
                type: MESSAGE_TYPE,
                payload:
                {
                    messageType: 'loading',
                    messageContent: `Opdater bruger med Email: ${updateUser.email} - Vent venligst!`,
                    time: moment().add(3, 'seconds').valueOf()
                }
            });
            this.updateUserButtonBlock.block = true;
            updateUser(userToEdit, this.updateUserButtonBlock, setModalState);
        }
        //if (validateUserEditInput('selectedUserPassword', 'selectedUserEmail', 'selectedUserPhone') == true)
        //{
        //} 
    }



    addUserToRoleSend = (roleName) => {
        const { addUserToRole, selectedUser, setSelectedUserState } = this.props;
        addUserToRole(selectedUser.email, roleName, this.setStateOfAddRoleDropDown, selectedUser, setSelectedUserState);
    }


    setStateOfAddRoleDropDown = () => {
        this.setState({ selectedRoleDropBox: '' });
    }



    handleRoleChangeDropBox = (e) => {
        this.setState({ selectedRoleDropBox: e.currentTarget.value });
    }


    // Render ===================================================================================================================================================
    render() {
        const { isOpen, toggleEditUserModal, selectedUser, allRoles, updateUser, addUserToRole } = this.props;
        const { selectedRoleDropBox } = this.state;

        let filteredRoles = [];

        if (isOpen == true && allRoles[0] !== undefined) {
            filteredRoles = getUnassaignedRolesForUser(allRoles, selectedUser.roles);
        }

        return (
            <>
                {/*Modal - Add Customer Contact Person _________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________*/}
                <Modal backdropTransition={{ timeout: 0 }} modalTransition={{ timeout: 0 }} fade={false} isOpen={isOpen} size="xl" toggle={toggleEditUserModal}>
                    <ModalHeader toggle={toggleEditUserModal}><span className="title"><FontAwesomeIcon className="fa-lg mr-2" icon={faUserEdit} />Rediger Bruger</span>:</ModalHeader>
                    <ModalBody>
                        <h2 className="inline">&nbsp;{selectedUser.firstName}</h2>
                        <hr />
                        <form ref={this.currentFormRef} onSubmit={(e) => this.updateUserSend(e, selectedUser)}>

                            <UserFields handleChange={this.handleOnchangeEditUser} user={selectedUser} />
                            <br />
                            <hr />

                            {/*Send Button*/}
                            <div className="mr-4 my-2 inline">
                                <button type="submit" className="btn btn-primary ml-2 py-1p"><FontAwesomeIcon className="fa-lg mr-2" icon={faSave} />Opdater Bruger</button>
                            </div>
                        </form>
                        <hr className="line-d-t-black" />


                        {/*ADD ROLE*/}
                        <div className="inline">
                            <div>
                                {filteredRoles[0] !== undefined ? <>
                                    <p className="h4 mt-3 inline"><FontAwesomeIcon className="fa-lg mr-1 mini-title" icon={faPlus} /><FontAwesomeIcon className="fa-lg mr-2" icon={faUserTag} />Tilføj Rolle</p>

                                    <div className="inline">
                                        <select ref={this.addRoleDropDown} name="roles" id={"addRoleDropDown"} defaultValue={filteredRoles[0].name} className="form-control mt-2" onChange={this.handleRoleChangeDropBox}>
                                            {
                                                filteredRoles.map((role, index) => {
                                                    return <option key={role.id} value={role.name}>{role.name}</option>
                                                })
                                            }
                                        </select>

                                        <button type="button" onClick={() => this.addUserToRoleSend(selectedRoleDropBox)} className="btn btn-primary mt-2 ml-2 text-nowrap"><FontAwesomeIcon className="fa-lg mr-1 mini-title" icon={faPlus} />Tilføj</button>
                                    </div>
                                    <br />

                                </>
                                    : ''}

                            </div>
                        </div>
                        <hr className="line-d-t-black" />


                        <div className="inline">
                            <div>
                                {/*USER ROLES*/}
                                {selectedUser.roles !== undefined ?
                                    selectedUser.roles[0].roleName !== "" ?
                                        <div className="p-2 inline-block m-l-r-auto">
                                            <p className="h4 mt-3 inline"><FontAwesomeIcon className="fa-lg mr-2" icon={faUserTag} />Roller</p>

                                            {selectedUser.roles.map((role, index) => {
                                                return <li key={index} className="mb-3 line-t font-weight-bold">
                                                    <span className="mr-3">{role.roleName}</span>
                                                    <div className="float-right">
                                                        <span onClick={() => this.deleteUserRoleSend(selectedUser.email, role.roleName)} className="no-select red-t ml-3px">Fjern<FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faTrashAlt} /></span>
                                                    </div>
                                                </li>;
                                            })}
                                        </div> : <><p className="h4 mt-3 inline">Roller</p><FontAwesomeIcon className="fa-lg mr-2" icon={faExclamationTriangle} />Ingen Roller</>
                                    : ''}

                            </div>
                        </div>

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
export default connect(mapStateToProps, { deleteUserRole, updateUser, addUserToRole })(UserEditModal);




