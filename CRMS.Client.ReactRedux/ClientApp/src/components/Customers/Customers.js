import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { addCustomer, fetchCustomers } from '../../actions/customersActions';
import Table from '../common/Table';
import { getCustomersWithStatus } from '../../Logic/customersLogic';


// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faPlusSquare, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons'
import { tryConvertToInt, onlyLettersAndSpace, onlyNumbers, noLetters } from '../../Logic/validationLogic';
import { customersColumns, defaultNewcustomer } from '../../Definitions/customersDefinitions';
import AddCustomer from './AddCustomer';

class Customers extends Component {

    customer = defaultNewcustomer;

    state = { openAddCustomerModal: false, newCustomer: this.customer }

    toggleAddCustomerModal = () => {
        this.setState({
            openAddCustomerModal: !this.state.openAddCustomerModal,
            newCustomer: this.customer
        });
    }


    handelOnRowClick = (item) => {

        this.props.history.push(`Customer/${item.customerNumber}`);
    }


    //handleChangeAddCustomer = (e) => {

    //    //const contact = { ...selectedContact, [e.target.name]: e.target.value }
    //    const { newCustomer } = this.state;

    //    e.target.style.backgroundColor = "white";

    //    let customer = {};
    //    if (e.target.name === 'customerGroup') {
    //        customer = { ...newCustomer, ["customerGroup"]: { customerGroupNumber: tryConvertToInt(e.target.value) } }
    //    }
    //    else {
    //        customer = { ...newCustomer, [e.target.name]: e.target.value }
    //    }

    //    this.setState({ newCustomer: customer });
    //}


    setStateNewCustomer = (customerData) => {
        this.setState({ newCustomer: customerData });
    }

    addNewCustomer = (blockAddCustomerButton) => {
        const { newCustomer } = this.state;
        this.props.addCustomer(newCustomer, this.setStateOpenAddCustomerModal, blockAddCustomerButton);
    }


    setStateOpenAddCustomerModal = (bool) => {
        this.setState({ openAddCustomerModal: bool });
    }

    tableHtml = <a className="m-t-b-auto inline" href="https://secure.e-conomic.com/sales/customers" target="_blank"><FontAwesomeIcon className="fa-lg mr-1" icon={faLink} /><FontAwesomeIcon className="fa-lg mr-3 mini-title" icon={faUsers} /></a>;

    render() {
        const { newCustomer } = this.state;
        const { customers, subscriptions } = this.props;
        const Data = getCustomersWithStatus(customers, subscriptions);

        //if (!this.props.isLoaded) return <p>Loader...</p>;

        return (

            <div>
                <AddCustomer toggleAddCustomerModal={this.toggleAddCustomerModal} openAddCustomerModal={this.state.openAddCustomerModal} newCustomer={newCustomer} addNewCustomer={this.addNewCustomer} setStateNewCustomer={this.setStateNewCustomer} />
                {/*CUSTOMERS - CONTENT ====================================================================================================================================*/}
                <div className="no-select">
                    <p className="customer-status-info-label">
                        <img alt="" src="../img/status_green.png" /> Der ligger fakturaer klar til at blive sendt til E-conomic.
                    </p>
                    <p className="customer-status-info-label">
                        <img alt="" src="../img/status_neutral.png" /> Kunden har abonnementer og de er alle up-to-date.
                    </p>
                    <p className="customer-status-info-label">
                        <img alt="" src="../img/status_red.png" /> Kunden har <strong>INGEN</strong> abonnementer.
                    </p>
                </div>
                <span onClick={this.toggleAddCustomerModal} className="ico-dark right-icon no-select">Opret Ny Kunde<FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faUserPlus} /></span>
                <Table onRowClick={this.handelOnRowClick} tableColumns={customersColumns} html={this.tableHtml} tableData={this.props.isLoaded == true ? Data : []} tableTitle="KUNDER" tableIcon={<span className="ml-2 inline"><FontAwesomeIcon className="fa-lg mr-2" icon={faUsers} /> KUNDER </span>} />
            </div>
        );
    }

}

Customers.propTypes = {
    fetchCustomers: PropTypes.func.isRequired,
    customers: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({

    customers: state.customers.list,
    subscriptions: state.subscriptions.list,
    isLoaded: state.customers.isLoaded,
    allDomains: state.allDomains.list,
    Users: state.users
});

export default connect(mapStateToProps, {
    addCustomer,
    fetchCustomers,
})(Customers);










