import { faUser, faUserShield, faUserTie, faUserPlus, faUserFriends, faAt, faIdCard, faUserTag, faPhoneSquareAlt, faToolbox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { deleteUser, fetchUsersWithRoles } from '../../../actions/adminActions';
import { editAndDeleteButtonHtml } from '../../../Definitions/commonDefinitions';
import { getUserRolesAsHtml } from '../../../Logic/usersLogic';

import Table from '../../common/Table';
import CreateUserModal from './CreateUserModal';
import UserEditModal from './UserEditModal';



class Users extends Component {
    state = { editUserModalIsOpen: false, createUserModalIsOpen: false, selectedUser: {} };

    userColumns = [
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faAt} />EMAIL</>, path: "email" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faIdCard} />NAVN</>, path: "firstName" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faUserTag} />ROLLER</>, path: "roles", content: (user) => getUserRolesAsHtml(user) },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faPhoneSquareAlt} />TELEFON</>, path: "phoneNumber" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faToolbox} />FUNKTIONER</>, path: "", content: (user) => editAndDeleteButtonHtml(this.editUser, this.deleteUser, user) }];


    toggleEditUserModal = () => {
        this.setState({ editUserModalIsOpen: !this.state.editUserModalIsOpen });
    }



    toggleCreateUserModal = () => {
        this.setState({ createUserModalIsOpen: !this.state.createUserModalIsOpen });
    }




    componentWillMount() {
        const { fetchUsersWithRoles } = this.props;
        fetchUsersWithRoles();
    }


    editUser = (data) => {
        this.setState({ selectedUser: data });
        this.toggleEditUserModal();
    }


    deleteUser = (user) => {
        let result = window.confirm(`Vil du slette bruger med email - ${user.email} ?`);

        if (result == true) {
            const { deleteUser } = this.props;
            deleteUser(user.email);
        }
    }


    setSelectedUserState = (state) => {
        this.setState({ selectedUser: state });
    }


    setStatEeditUserModalIsOpen = (bool) => {
        this.setState({ editUserModalIsOpen: bool });
    }


    setStateCreateUserModalIsOpen = (bool) => {
        this.setState({ createUserModalIsOpen: bool });
    }

    // Render ===================================================================================================================================================
    render() {
        const { usersWithRoles } = this.props;
        const { editUserModalIsOpen, createUserModalIsOpen, selectedUser } = this.state;

        return (
            <>
                <span className="font-weight-bold"><FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faUserShield} /> Admin</span><span> - har tilladelse til alt</span>
                <div className="my-2"><span className="font-weight-bold"><FontAwesomeIcon className="fa-lg ml-3 mr-3" icon={faUserTie} />  User </span><span className="my-3">- har tilladelse til CRUD men ikke Admin operationer</span></div>
                <span className="font-weight-bold"><FontAwesomeIcon className="fa-lg ml-3 mr-3" icon={faUser} />  Guest </span><span>- har tilladelse kun til at læse</span>

                {/*USERS*/}
                <div className="table-container table-responsive subDiv">
                    <div className="title-t mt-2">
                        <span onClick={this.toggleCreateUserModal} className="ico-dark right-icon no-select mr-5">Opret Bruger<FontAwesomeIcon className="fa-lg ml-3" icon={faUserPlus} /></span>
                    </div>
                    <Table className="my-5" tableColumns={this.userColumns} tableData={usersWithRoles} tableTitle="BRUGERE" tableIcon={<span className="ml-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faUserFriends} /> BRUGERE </span>} tableContainerClass={'table-holder-h-fit'} tableId={'usersTable'} excelFilter={'removeLastColumn'} />
                </div>
                <UserEditModal isOpen={editUserModalIsOpen} selectedUser={selectedUser} toggleEditUserModal={this.toggleEditUserModal} setSelectedUserState={this.setSelectedUserState} setModalState={this.setStatEeditUserModalIsOpen} />
                <CreateUserModal toggleCreateUserModal={this.toggleCreateUserModal} createUserModalIsOpen={createUserModalIsOpen} setModalState={this.setStateCreateUserModalIsOpen} />
            </>
        );
    }
}
const mapStateToProps = state => ({
    usersWithRoles: state.usersWithRoles.list,
    Users: state.users
});
export default connect(mapStateToProps, { fetchUsersWithRoles, deleteUser })(Users);




