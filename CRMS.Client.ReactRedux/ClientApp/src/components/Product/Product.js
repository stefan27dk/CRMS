import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteProduct, dispatchCurrentProduct, fetchProduct, updateProduct } from '../../actions/productActions';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faCoins, faCube, faEdit, faHashtag, faInfoCircle, faLayerGroup, faPen, faSignature, faStream, faTimes, faTrashAlt, faUsers } from '@fortawesome/free-solid-svg-icons'
import { DDmmYYYYhhMMss } from '../../Definitions/commonDefinitions';
import * as _ from 'lodash';
import * as moment from 'moment';
import { customersColumns } from '../../Definitions/customersDefinitions';
import { getCustomersWithStatus } from '../../Logic/customersLogic';
import Table from '../common/Table';
import ProductModal from './ProductModal';
import store from '../../store';
import { MESSAGE_TYPE } from '../../actions/types';


class Product extends Component {

    state = { editProductModalIsOpen: false }



    componentDidMount() {
    }




    deleteProduct = () => {
        const { product, deleteProduct, history } = this.props;

        if (this.productCustomers().length > 0) {
            store.dispatch(
                {
                    type: MESSAGE_TYPE,
                    payload:
                    {
                        messageType: 'warning',
                        messageContent: `Produkt med Navn: ${product.name} kan ikke slettes fordi der er kunder der bruger den produkt!`,
                        time: moment().add(3, 'seconds').valueOf()
                    }
                }
            );
        }
        else {
            let result = window.confirm(`Vil du slette Produkt - ${product.name}?`);
            if (result) {
                deleteProduct(product.productNumber, history);
            }
        }
    }



    toggleEditProductModal = () => {
        const { editProductModalIsOpen } = this.state;
        this.setState({ editProductModalIsOpen: !editProductModalIsOpen });
    }



    updateProductSend = (product, blockSendActionButton, modalSetState) => {
        const { updateProduct } = this.props;
        updateProduct(product, product.productNumber, blockSendActionButton, modalSetState);
    }



    productInfo = () => {
        const { product } = this.props;
        return (
            <>
                {/*Product - Info Container*/}
                <div className="info-container">
                    <div className="title-t">
                        <span className="h4 autoResizeFont-big"><FontAwesomeIcon className="fa-lg mr-2" icon={faInfoCircle} />PRODUKT INFORMATION </span>
                        <span onClick={this.toggleEditProductModal} className="ico-dark right-icon no-select ml-4">Rediger Produkt<FontAwesomeIcon className="fa-lg ml-3" icon={faPen} /></span>
                        <span onClick={this.deleteProduct} className="ico-dark right-icon no-select">Slet Produkt<FontAwesomeIcon className="fa-lg ml-3" icon={faTrashAlt} /></span>
                    </div>


                    {/*Top*/}
                    <div className="info-top-container subDiv">

                        {/*ID, NAME, PRICE.*/}
                        <div className="p-2 inline-block">
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faHashtag} />ID:</p><p className="no-wrap m-0">{product.productNumber}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faSignature} />NAVN:</p><p className="no-wrap m-0">{product.name}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faCoins} />PRIS:</p><p className="no-wrap m-0">{product.salesPrice} kr.</p></div>
                        </div>


                        {/*Unit, GroupNumber, Active*/}
                        <div className="p-2 inline-block">
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faStream} />ENHED:</p><p className="no-wrap m-0">{product.unit !== undefined && product.unit !== null ? product.unit.name : '-'}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faTimes} />TILSTAND:</p><p className="no-wrap m-0">{product.barred === true ? 'Inaktiv' : 'Aktiv'}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faLayerGroup} />PRODUKT GRUPPE:</p><p className="no-wrap m-0">{product.productGroup.productGroupNumber + ': ' + product.productGroup.name}</p></div>
                        </div>


                        {/*Last Updated, Description*/}
                        <div className="p-2 inline-block">
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faCalendarPlus} />SIDST OPDATERET:</p><p className="no-wrap m-0">{moment(product.lastUpdated).format(DDmmYYYYhhMMss)}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faInfoCircle} />BESKRIVELSE</p><p className="no-wrap m-0">{product.description !== undefined ? product.description : '-'}</p></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }



    productCustomers = () => {
        const { subscriptions, customers, product, allDomains } = this.props;

        let assambledCustomers = getCustomersWithStatus(customers, subscriptions, allDomains);

        let productSubscriptions = subscriptions.filter(s => s.productId == product.productNumber);
        let productCustomers = [];
        for (let i = 0; i < productSubscriptions.length; i++) {
            productCustomers.push(assambledCustomers.find(c => c.customerNumber == productSubscriptions[i].customerId));
        }

        return productCustomers;
    }



    handelOnRowClick = (item) => {

        this.props.history.push(`/Customer/${item.customerNumber}`);
    }


    setStateEditProductModalIsOpen = (bool) => {
        this.setState({ editProductModalIsOpen: bool });

    }



    render() {
        const { customers, products, product } = this.props;
        const { editProductModalIsOpen } = this.state;

        const currentProduct = products.find(p => p.productNumber == this.props.match.params.Id);
        this.props.dispatchCurrentProduct(currentProduct);


        if (product === undefined || product === null || Object.keys(product).length === 0) return <p>Ingen Produkt med den ID</p>;
        if (!this.props.isLoaded || customers[0] == undefined) return <p>Loader...</p>;

        return (
            <>
                <ProductModal productModalIsOpen={editProductModalIsOpen} toggleProductModal={this.toggleEditProductModal} postAction={this.updateProductSend} modalTitle="Rediger Produkt" modalicon={<FontAwesomeIcon className="fa-lg mr-2" icon={faEdit} />} currentProduct={product} modalSetState={this.setStateEditProductModalIsOpen} />
                {this.productInfo()}
                <br />
                <Table onRowClick={this.handelOnRowClick} tableColumns={customersColumns} tableData={this.productCustomers()} tableIcon={<span className="ml-2 inline"><FontAwesomeIcon className="fa-lg mr-2" icon={faCube} /><FontAwesomeIcon className="fa-lg mr-2 mini-title" icon={faUsers} />KUNDER PÅ PRODUKTET </span>} tableTitle={"KUNDER PÅ PRODUKTET"} />
            </>
        );
    }
}



Product.propTypes = {
    fetchProduct: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
    product: state.product.item,
    products: state.products.list,
    subscriptions: state.subscriptions.list,
    customers: state.customers.list,
    allDomains: state.allDomains.list,
    isLoaded: state.product.isLoaded,
    Users: state.users
});

export default connect(mapStateToProps, { fetchProduct, updateProduct, deleteProduct, dispatchCurrentProduct })(Product);







