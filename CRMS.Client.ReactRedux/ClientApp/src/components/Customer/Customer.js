import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteCustomerContactPerson, fetchCustomer, fetchCustomerContactPersons, updateCustomerContactPersons, updateCustomer, addCustomerContactPerson, deleteCustomer } from '../../actions/customerActions';
import { addDomain, deleteDomain, updateDomain } from '../../actions/domainsActions';
import { addCustomerSubscription } from '../../actions/customerActions';
import * as _ from 'lodash';
import { deleteSubscription, updateSubscription } from '../../actions/subscriptionsActions';
import CustomerInfo from './CustomerInfo';
import CustomerSubscriptions from './CustomerSubscriptions';
import CustomerAddSubscriptions from './CustomerAddSubscriptions';
import { alertMessage } from '../../actions/messageActions';



// Class #################################################################################################################################
class Customer extends Component {

    // Did Mount =======================================================================================================================
    componentDidMount() {
        this.props.fetchCustomerContactPersons(this.props.match.params.Id);
    }


    // Render ===================================================================================================================
    render() {
        const { customers, products, subscriptions, customerContactPersons, updateCustomerContactPersons,
            addDomain, deleteDomain, deleteCustomerContactPerson, updateSubscription, deleteSubscription,
            addCustomerSubscription, updateCustomer, addCustomerContactPerson, updateDomain, deleteCustomer, history } = this.props;

        const customer = customers.find(x => x.customerNumber == this.props.match.params.Id);
        if (customer == null || customer == undefined || Object.keys(customer).length === 0) return <p>Ingen Kunde med den ID</p>;
        if (customers.length === 0) return <p>Loader...</p>;

        return (
            <div className="center-container">

                {/*Customer - Content ____________________________________________________________________________________________________________*/}

                {/*CUSTOMER INFO*/}
                <CustomerInfo customer={customer}
                    customerContactPersons={customerContactPersons}
                    updateCustomerContactPersons={updateCustomerContactPersons}
                    addDomain={addDomain}
                    deleteDomain={deleteDomain}
                    deleteCustomerContactPerson={deleteCustomerContactPerson}
                    updateCustomer={updateCustomer}
                    subscriptions={subscriptions}
                    addCustomerContactPerson={addCustomerContactPerson}
                    updateDomain={updateDomain}
                    deleteCustomer={deleteCustomer}
                    history={history}
                    subscriptions={subscriptions} />

                {/*CUSTOMER - SUBSCRIPTIONS*/}
                <CustomerSubscriptions products={products} domains={customer.domains}
                    subscriptions={subscriptions} customerId={customer.customerNumber}
                    products={products} updateSubscription={updateSubscription} deleteSubscription={deleteSubscription}
                />

                {/*ADD - SUBSCRIPTIONS*/}
                <CustomerAddSubscriptions addCustomerSubscription={addCustomerSubscription} products={products} subscriptions={subscriptions} domains={customer.domains} customerId={customer.customerNumber} />

            </div>
        );
    }

}



// Map STATE to Props ===========================================================================================================
const mapStateToProps = state => ({
    customers: state.customers.list,
    customerContactPersons: state.customerContactPersons.list,
    products: state.products.list,
    subscriptions: state.subscriptions.list,
    isLoaded: state.customer.isLoaded,
    Users: state.users
});

export default connect(mapStateToProps, {
    fetchCustomerContactPersons,
    deleteCustomerContactPerson,
    addDomain,
    updateCustomerContactPersons,
    deleteSubscription,
    deleteDomain,
    updateSubscription,
    addCustomerSubscription,
    updateCustomer,
    updateDomain,
    addCustomerContactPerson,
    deleteCustomer

})(Customer);



