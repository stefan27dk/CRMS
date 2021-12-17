import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


import { DDmmYYYYhhMMss, units } from '../../Definitions/commonDefinitions';
import * as moment from 'moment';
import { onlyNumbersAndComma, tryConvertToInt } from '../../Logic/validationLogic';
import * as _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faCalendarPlus, faCoins, faDollarSign, faExclamationTriangle, faHashtag, faInfoCircle, faLayerGroup, faSave, faSignature, faStream, faTimes } from '@fortawesome/free-solid-svg-icons';
import { validateProduct } from '../../Logic/productsLogic';
import { MESSAGE_TYPE } from '../../actions/types';
import store from '../../store';



class ProductModal extends Component {

    state = { currentModalProduct: this.props.currentProduct }

    inactiveErrorMsgP = React.createRef();
    currentProductForm = React.createRef();
    blockSendActionButton = { block: false };



    componentWillReceiveProps() {
        const { productModalIsOpen } = this.props;
        if (productModalIsOpen !== true) {
            this.setState({ currentModalProduct: this.props.currentProduct })
        }
    }



    handleChangeProduct = (e) => {
        const { currentModalProduct } = this.state;
        const { modalTitle, subscriptions, currentProduct } = this.props;
        let product = {};

        validateProduct(this.currentProductForm);

        // Product Group
        if (e.target.name === 'productGroup') {
            product = { ...currentModalProduct, ["productGroup"]: { productGroupNumber: tryConvertToInt(e.target.value) } }
        }
        // Unit
        else if (e.target.name === 'unit') {
            product = { ...currentModalProduct, ["unit"]: { unitNumber: tryConvertToInt(e.target.value) } }
        }
        // Barred
        else if (e.currentTarget.name === 'barred')
        {
            if (e.currentTarget.checked == true) {
                let productSub = subscriptions.find(s => s.productId == currentProduct.productNumber);
                if (productSub == undefined) {
                    product = { ...currentModalProduct, barred: e.currentTarget.checked }
                }
                else {
                    e.currentTarget.checked = false;
                    this.timeOutinactiveErrorMessage();
                    return;
                }
            }
            else
            {
                product = { ...currentModalProduct, barred: false}

            }
        }
        else {
            product = { ...currentModalProduct, [e.target.name]: e.target.name === 'description' || e.target.name === 'name' ? e.target.value : tryConvertToInt(e.target.value) }
        }
        this.setState({ currentModalProduct: product });
    }



    timeOutinactiveErrorMessage = () => {
        this.inactiveErrorMsgP.current.hidden = false;
        setTimeout(() => { if (this.inactiveErrorMsgP.current !== null) this.inactiveErrorMsgP.current.hidden = true; }, 7000);
    }


    sendProductAction = (event) => {
        event.preventDefault();
        const { postAction, modalTitle, modalSetState } = this.props;
        const { currentModalProduct } = this.state;



        if (validateProduct(this.currentProductForm) == true && this.blockSendActionButton.block == false) {
            // Dispatch - Loading -------------------------
            store.dispatch({
                type: MESSAGE_TYPE,
                payload:
                {
                    messageType: 'loading',
                    messageContent: modalTitle == "Opret Produkt" ? `Opretter Produkt: ${currentModalProduct.name} - Vent venligst!` : `Opdater Produkt: ${currentModalProduct.name} - Vent venligst!`,
                    time: moment().add(3, 'seconds').valueOf()
                }
            });
            this.blockSendActionButton.block = true;
            postAction(currentModalProduct, this.blockSendActionButton, modalSetState);
        }
    }


    render() {
        const { productGroups, toggleProductModal, productModalIsOpen, modalTitle, postAction, hideIdInput, modalicon } = this.props;
        const { currentModalProduct } = this.state;

        return (
            <>
                {/*Modal -Edit Product ____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________*/}
                <Modal backdropTransition={{ timeout: 0 }} modalTransition={{ timeout: 0 }} fade={false} isOpen={productModalIsOpen} size="xl" toggle={toggleProductModal}>
                    <form ref={this.currentProductForm} name="currentProductForm" onSubmit={(e) => this.sendProductAction(e)}>
                        <ModalHeader toggle={toggleProductModal}><span className="title">{modalicon}{modalTitle}</span></ModalHeader>
                        <ModalBody>
                            <h2 className="inline">{currentModalProduct.name}&nbsp;</h2>
                            <hr />
                            <div className="d-flex flex-row flex-wrap inline">

                                {/*<input className={`form-control input ${addNewIsValid ? 'is-valid' : 'is-invalid'}`} onChange={this.handleChangeNewDomain} name="newDomain" value={newDomain} type="text" />*/}

                                {/*ID -------------*/}
                                {hideIdInput ? '' : (<div className="mr-4 my-3">
                                    <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2" icon={faHashtag} />Id: </p>
                                    <input name="id" className="form-control" disabled defaultValue={currentModalProduct.productNumber} type="text" />
                                </div>)}



                                {/*NAME -------------*/}
                                <div className="mr-4 my-3">
                                    <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2" icon={faSignature} />Navn: </p>
                                    <input name="name" className="form-control" defaultValue={currentModalProduct.name} onChange={this.handleChangeProduct} maxLength="50" type="text" />
                                </div>


                                {/*PRICE -------------*/}
                                <div className="mr-4 my-3">
                                    <p className="h6 title ml-1"><FontAwesomeIcon className="fa-lg mr-2" icon={faCoins} />Pris:</p>
                                    <input name="salesPrice" className="form-control" defaultValue={currentModalProduct.salesPrice} onKeyPress={onlyNumbersAndComma} onChange={this.handleChangeProduct} maxLength="10" type="text" />
                                </div>


                                {/*UNIT -------------*/}
                                <div className="mr-4 my-3">
                                    <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2" icon={faStream} />Enhed:</p>
                                    <select name="unit" className="form-control" defaultValue={currentModalProduct.unit !== undefined && currentModalProduct.unit !== null ? currentModalProduct.unit.unitNumber : 0} onChange={this.handleChangeProduct}>
                                        {
                                            units.map((unit, index) => {
                                                if (index !== 0) {
                                                    return <option key={unit.id} value={unit.id}>{unit.name}</option>
                                                }
                                            })
                                        }
                                    </select>
                                </div>



                                {/*Barred -------------*/}
                                <div className="mr-4 my-3">
                                    <p className="h6 title display-rows ml-3"><FontAwesomeIcon className="fa-lg mr-2" icon={faTimes} />Inaktiv:</p>
                                    <input name="barred" className="ml-2 form-control" defaultChecked={currentModalProduct.barred} onClick={this.handleChangeProduct} maxLength="10" type="checkbox" />
                                </div>




                                {/*Product Group -------------*/}
                                <div className="mr-4 my-2 ml-3">
                                    <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faLayerGroup} />Produkt Gruppe:</p>
                                    <select className="form-control" name="productGroup" defaultValue={currentModalProduct.productGroup !== undefined ? currentModalProduct.productGroup.productGroupNumber : ''} onChange={this.handleChangeProduct}>
                                        {
                                            productGroups.map((group) => {
                                                return <option key={group.productGroupNumber} value={group.productGroupNumber}>{group.productGroupNumber + ": " + group.name}</option>
                                            })
                                        }
                                    </select>
                                </div>



                                {/*Description  -------------*/}
                                <div className="mr-4 my-3">
                                    <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faInfoCircle} />Beskrivelse: </p>
                                    <input name="description" className="form-control" defaultValue={currentModalProduct.description === null ? '' : currentModalProduct.description} onChange={this.handleChangeProduct} maxLength="50" type="text" />
                                </div>


                                {/* Last Updated -------------*/}
                                <div className="mr-4 my-3">
                                    <p className="h6 title"><FontAwesomeIcon className="fa-lg mr-2 ml-1" icon={faCalendarPlus} />Sidst Opdateret:</p>
                                    <input name="lastUpdated" className="form-control" disabled defaultValue={moment(currentModalProduct.lastUpdated).format(DDmmYYYYhhMMss)} type="text" />
                                </div>
                            </div>
                        </ModalBody>

                        <p ref={this.inactiveErrorMsgP} hidden className="text-danger inline font-weight-bold"><FontAwesomeIcon className="fa-lg mr-2" icon={faExclamationTriangle} />Kan ikke marker den produkt som Inaktiv - der er abonnementer der bruger den produkt!</p>
                        <ModalFooter>
                            <Button color="primary" type="submit"><FontAwesomeIcon className="fa-lg mr-2" icon={faSave} />{modalTitle}</Button>{' '}
                        </ModalFooter>
                    </form>
                </Modal>

            </>
        );
    }
}


const mapStateToProps = state => ({
    productGroups: state.productGroups.list,
    subscriptions: state.subscriptions.list,
    Users: state.users
});

export default connect(mapStateToProps, {})(ProductModal);







