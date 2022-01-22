import * as _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getMostOccurringProducts } from '../Logic/productsLogic';
import { calcSubsPriceForCustomer } from '../Logic/customersLogic';
import { fetchAllDomains } from '../actions/domainsActions';
import Product from './Product/Product';
import { getSubscriptionsValues } from '../Logic/subscriptionsLogic';




class Home extends Component {
    componentWillMount() {
        const { fetchAllDomains } = this.props;
        fetchAllDomains();
    }

    // Calc Product  Price
    productCalcPrice = (productRaw, products) => {
        let product = products.find(p => p.productNumber == productRaw[0]);
        return (<span className="font-weight-bold">{product.name + ' x ' + productRaw[1].count + ' : '}<u>{(product.salesPrice * productRaw[1].quantity * 12).toFixed(2) + ' kr.'}</u></span>);
    }


    // Get Customer Name and Price
    customerNamePrice = (customerRaw, customers) => {
        let customer = customers.find(c => c.customerNumber == customerRaw[0]);
        return (<span className="font-weight-bold">{customer.name + ' : '}<u>{customerRaw[1] + ' kr.'}</u></span>);
    }




    render() {
        //const { subscriptions, products, customers, allDomains } = this.props;
        const { subscriptions, products, customers, allDomains } = this.props;

        //if (subscriptions === undefined || products[0] === undefined || customers[0] === undefined || allDomains[0] === undefined) return <p>Loader...</p>;


        let totalSubAmount;
        if (products !== undefined && products !== null && products.length > 0) {
            totalSubAmount = getSubscriptionsValues(subscriptions, products);
        }

        return (
            <div className="container-holder">

                {/*TOP PRODUCTS*/}
                <div className="item-container">
                    <p className="font-weight-bold h5 inline">Top 5 Produkter:</p>
                    <hr />
                    {subscriptions[0] !== undefined && products[0] !== undefined ? getMostOccurringProducts(subscriptions, 5).map((productRaw) => {
                        return (<div key={productRaw[0]}>{this.productCalcPrice(productRaw, products)}<br /></div>);
                    }) : ""}
                </div>


                {/*TOP CUSTOMERS*/}
                <div className="item-container">
                    <p className="font-weight-bold h5 inline">Top 5 Kunder:</p>
                    <hr />

                    {subscriptions[0] !== undefined && products[0] !== undefined && customers[0] !== undefined ? calcSubsPriceForCustomer(subscriptions, products, 5).map((customeRaw) => {
                        return (<div key={customeRaw[0]}>{this.customerNamePrice(customeRaw, customers)}<br /></div>);
                    }) : ""}
                </div>


                {/*ALL - COUNT */}
                <div className="item-container">
                    <p className="font-weight-bold h5 inline">Antal:</p>
                    <hr />
                    <p>Abonnementer: {subscriptions[0] !== undefined ? subscriptions.length : '0'}</p>
                    <p>Kunder: {customers[0] !== undefined ? customers.length : '0'}</p>
                    <p>Produkter: {products[0] !== undefined ? products.length : '0'}</p>
                    <p>Domæner: {allDomains[0] !== undefined ? allDomains.length : '0'}</p>
                </div>

                <div className="item-container">
                    <p className="font-weight-bold h5 inline">Omsætning:</p>
                    <hr />
                    <p>Pr År: {totalSubAmount?.yearly} kr.</p>
                    <p>Pr Mdr: {totalSubAmount?.monthly} kr.</p>
                </div>

            </div>

        );
    }
}


const mapStateToProps = state => ({
    products: state.products.list,
    subscriptions: state.subscriptions.list,
    customers: state.customers.list,
    allDomains: state.allDomains.list,
    isLoaded: state.product.isLoaded,
    Users: state.users
});

export default connect(mapStateToProps, { fetchAllDomains })(Home);
