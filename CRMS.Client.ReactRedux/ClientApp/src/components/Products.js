import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addProduct, fetchProducts } from '../actions/productsActions';
import _ from 'lodash';
import Table from './common/Table';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCube, faCubes, faEdit, faLink, faPlus, faPlusSquare, faSquare } from '@fortawesome/free-solid-svg-icons'
import { tryConvertToInt } from '../Logic/validationLogic';
import ProductModal from './Product/ProductModal';
import { productsColumns } from '../Definitions/productsDefinitions';


//const columns = [
//    { title: "ID", path: "productNumber" },
//    { title: "NAVN", path: "name" },
//    { title: "PRIS", path: "salesPrice", content: (data) => { if (data.salesPrice !== undefined) { return data.salesPrice + " kr."; } else { return ""; } } },
//    { title: "ENHED", path: "unit", content: (data) => data.unit !== undefined && data.unit !== null ? data.unit.name : '-' },
//    { title: "BESKRIVELSE", path: "description" },
//    { title: "PRODUKTGRUPPE", path: "productGroup.productGroupNumber", content: (data) => data.productGroup.productGroupNumber },
//    { title: "ANTAL KUNDER", path: "customersCount" },
//    { title: "ANTAL ABONNEMENTER", path: "subscriptionsCount" },
//    { title: "TILSTAND", path: "barred", content: (data) => data.barred !== undefined ? data.barred === true ? 'Inaktiv': 'Aktiv' : '-'}];


class Products extends Component {

    componentWillMount() {
        this.props.fetchProducts();
    }


    state = { addProductModalIsOpen: false }

    toggleAddProductModal = () => {
        this.setState({ addProductModalIsOpen: !this.state.addProductModalIsOpen });
    }


    addNewProduct = (newProduct, blockSendActionButton, modalSetState) => {
        const { products, addProduct } = this.props;
        let newProductToAdd = newProduct;
        newProductToAdd.productNumber = (tryConvertToInt(products[products.length - 1].productNumber) + 1).toString(); // Because E-conomics does not auto generate the Id for Product but they do for Customer
        addProduct(newProductToAdd, blockSendActionButton, modalSetState);
    }

    assambleProducts = (products, subscriptions) => {
        let currentProductSubscriptions = [];
        let uniqueSubscriptions = _.uniqBy(subscriptions, (elem) => {
            return [elem.customerId, elem.productId].join(); // Unique CustomerId and ProductId - no doubles
        });

        _.forEach(products, (product) => {
            const customersCount = _.sumBy(uniqueSubscriptions, (sub) => sub.productId === +product.productNumber);

            const subscriptionsCount = _.sumBy(
                subscriptions,
                (sub) => sub.productId == product.productNumber
            );
            currentProductSubscriptions.push({ ...product, customersCount, subscriptionsCount })
        })

        return currentProductSubscriptions;
    }

    handelOnRowClick = (item) => {

        this.props.history.push(`Product/${item.productNumber}`);
    }


    setStateEaddProductModalIsOpen = (bool) => {
        this.setState({ addProductModalIsOpen: bool });
    }


    tableHtml = <a className="m-t-b-auto inline" href="https://secure.e-conomic.com/sales/products" target="_blank"><FontAwesomeIcon className="fa-lg mr-1" icon={faLink} /><FontAwesomeIcon className="fa-lg mr-3 mini-title" icon={faCubes} /></a>;

    render() {
        const { products, subscriptions } = this.props;
        const { addProductModalIsOpen } = this.state;

        if (products == undefined || subscriptions == undefined) return <p>Loader...</p>;

        return (
            <>
                <ProductModal productModalIsOpen={addProductModalIsOpen} toggleProductModal={this.toggleAddProductModal} postAction={this.addNewProduct} modalTitle={<span className="ml-2">Opret Produkt</span>} modalicon={<FontAwesomeIcon className="fa-lg mr-2" icon={faPlusSquare} />} currentProduct={{ productGroup: { productGroupNumber: 1 }, unit: { unitNumber: 1 } }} hideIdInput={true} modalSetState={this.setStateEaddProductModalIsOpen} />
                <span onClick={this.toggleAddProductModal} className="ico-dark right-icon no-select">Opret Ny Produkt<FontAwesomeIcon className="fa-lg mr-2 ml-3" icon={faPlusSquare} /></span>
                <Table onRowClick={this.handelOnRowClick} tableColumns={productsColumns} html={this.tableHtml} tableData={this.assambleProducts(products, subscriptions)} tableTitle="PRODUKTER" tableIcon={<span className="ml-2 inline"><FontAwesomeIcon className="fa-lg mr-2" icon={faCubes} /> PRODUKTER </span>} />
            </>
        );
    }

}

Products.propTypes = {
    fetchProducts: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired
};


const mapStateToProps = state => ({
    products: state.products.list,
    subscriptions: state.subscriptions.list,
    isLoaded: state.products.isLoaded,
    Users: state.users
});

export default connect(mapStateToProps, { fetchProducts, addProduct })(Products);







