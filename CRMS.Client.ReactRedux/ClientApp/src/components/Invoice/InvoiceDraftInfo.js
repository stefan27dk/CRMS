import { faAsterisk, faAt, faCalendar, faCalendarPlus, faCashRegister, faCoins, faCubes, faFileInvoice, faFlag, faGlobe, faGlobeAfrica, faHashtag, faHourglassEnd, faHourglassHalf, faIdCard, faIndustry, faInfoCircle, faLayerGroup, faMapMarkedAlt, faMapMarkerAlt, faMoneyBillWave, faPhoneSquareAlt, faReceipt, faSignature, faStickyNote, faStream, faTimes, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Table from '../common/Table';

class InvoiceDraftInfo extends Component {

    handelOnCustomerNameClick = () => {
        const { currentDraft } = this.props;
        this.props.history.push(`/Customer/${currentDraft.customer.customerNumber}`);
    }

    // Customer Information ============================================================================================================= 
    renderInvoiceDraftInfoSectionCustomer = () => {
        const { currentDraft, customers } = this.props;
        let customer = customers.find(c => c.customerNumber == currentDraft.customer.customerNumber);
        if (customer == undefined) return 'Kan ikke finde Kunde...';

        return (
            <>
                {/*Info Container*/}
                <div className="info-container">
                    <div className="title-t">
                        <span className="h4 autoResizeFont-big"><FontAwesomeIcon className="fa-lg mr-1" icon={faInfoCircle} /><FontAwesomeIcon className="fa-lg mr-2 mini-title" icon={faUsers} />KUNDE-INFORMATION </span>
                    </div>



                    {/*Top Container - Info   */}
                    {/*<br/>*/}
                    <div className="info-top-container subDiv">


                        {/*Customer - Info - Name, Address etc.*/}
                        <div className="p-2 inline-block">
                            <p onClick={this.handelOnCustomerNameClick} className="middle-icon bo-500 m-0 my-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faIdCard} />{currentDraft.recipient.name}</p>
                            <p className="m-0 my-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faMapMarkerAlt} />{currentDraft.recipient.address}</p>
                            <p className="m-0 my-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faFlag} />{currentDraft.delivery?.country}</p>
                            <p className="m-0 my-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faAsterisk} />{currentDraft.recipient.zip !== undefined ? currentDraft.recipient.zip : '' + " " + currentDraft.recipient.city !== undefined ? currentDraft.recipient.city : ''}</p>
                        </div>



                        {/*Customer - TLF - Mail, CVR*/}
                        <div className="p-2 inline-block">
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faAt} />{"FAKTURERINGSMAIL:"}</p><p className="no-wrap m-0">{customer.email}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-1" icon={faHashtag} /><FontAwesomeIcon className="fa-lg mr-2 mini-title" icon={faIndustry} />{"CVR:"}</p><p className="no-wrap">{customer.corporateIdentificationNumber}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faPhoneSquareAlt} />{"TELEFON:"}</p><p className="no-wrap">{customer.telephoneAndFaxNumber}</p></div>
                        </div>




                        {/*KundeGruppe*/}
                        <div className="p-2 inline-block">
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faLayerGroup} />KUNDEGRUPPE:</p><p className="no-wrap m-0">{customer.customerGroup !== undefined ? customer.customerGroup.customerGroupNumber : ''}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-1" icon={faHashtag} /><FontAwesomeIcon className="fa-lg mr-2 mini-title" icon={faUser} />KUNDE ID:</p><p className="no-wrap m-0">{customer.customerNumber}</p></div>
                            {customer.website !== undefined ? <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faGlobeAfrica} />{"KUNDE HJEMMESIDE:"}</p><a className="no-wrap m-0" href={"http://" + customer.website} target="_blank">{customer.website}</a></div> : ''}
                        </div>



                        {/*Customer - Domains*/}
                        <div className="p-2 inline-block">
                            <p className="m-0 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faGlobe} />{"DOMÆNER:"}</p>

                            {customer.domains.map((domain, index) => {
                                return <li key={"domainInfo" + domain.id + index} className="m-0"><a href={"http://" + domain.domainName} target="_blank">{domain.domainName}</a></li>;
                            })}
                        </div>
                    </div>
                </div>
            </>
        );
    }


    renderInvoiceDraftInfoSection = () => {
        const { currentDraft } = this.props;
        return (
            <>

                {/*Info Container*/}
                <div className="info-container">
                    <div className="title-t">
                        <br />
                        <span className="h4 autoResizeFont-big"><FontAwesomeIcon className="fa-lg mr-1" icon={faInfoCircle} /><FontAwesomeIcon className="fa-lg mr-2 mini-title" icon={faFileInvoice} />FAKTURA-INFORMATION </span>
                    </div>

                    {/*Top Container - Info   */}
                    <div className="info-top-container subDiv">


                        {/*Faktura Info*/}
                        <div className="p-2 inline-block">
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faCalendarPlus} />DATO OPRETTET:</p><p className="no-wrap m-0">{new Date(currentDraft.date).toLocaleDateString("en-UK").replace(/\//g, '-')}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-1" icon={faCalendar} /><FontAwesomeIcon className="fa-lg mr-2 mini-title" icon={faHourglassHalf} />LEVERINGSDATO:</p><p className="no-wrap m-0">{new Date(currentDraft.delivery?.deliveryDate).toLocaleDateString("en-UK").replace(/\//g, '-')}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-1" icon={faCalendar} /><FontAwesomeIcon className="fa-lg mr-2 mini-title" icon={faHourglassEnd} />FORFALDSDATO:</p><p className="no-wrap m-0">{new Date(currentDraft.dueDate).toLocaleDateString("en-UK").replace(/\//g, '-')}</p></div>
                        </div>



                        <div className="p-2 inline-block">
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faMoneyBillWave} />VALUTA:</p><p className="no-wrap m-0">{currentDraft.currency}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faCashRegister} />MOMS:</p><p className="no-wrap m-0">{currentDraft.vatAmount}{currentDraft.currency == "DKK" ? ' kr.' : currentDraft.currency}</p></div>
                        </div>


                        <div className="p-2 inline-block">
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faReceipt} />BETALINGS BETINGELSER:</p><p className="no-wrap m-0">{currentDraft.paymentTerms.name}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faHourglassHalf} />KREDITDAGE:</p><p className="no-wrap m-0">{currentDraft.paymentTerms.daysOfCredit}</p></div>
                        </div>


                        <div className="p-2 inline-block">
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faUser} />SENDT AF:</p><p className="no-wrap m-0">{currentDraft.draftLog?.userEmail}</p></div>
                            <div className="m-0 no-wrap"><p className="mr-2 bo-500 no-wrap"><FontAwesomeIcon className="fa-lg mr-2" icon={faUser} /><FontAwesomeIcon className="fa-lg mr-2 mini-title" icon={faCalendarPlus} />SENDT DEN:</p><p className="no-wrap m-0">{new Date(currentDraft.draftLog?.invoiceDateTime).toLocaleString("en-UK").replace(/\//g, '-')}</p></div>
                        </div>

                    </div>
                </div>
            </>
        );
    }


    getInvoiceDraftProducts = (currentDraft, products) => {
        let draftProducts = [];
        let length = currentDraft.lines.length;
        for (let i = 0; i < length; i++) {
            let currentProduct = products.find(p => p.productNumber == currentDraft.lines[i].product.productNumber);
            draftProducts.push(currentProduct);
        }
        return draftProducts;
    }



    handelOnProductRowClick = (item) => {

        this.props.history.push(`/Product/${item.productNumber}`);
    }

    productsColumns = [
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faHashtag} />ID</>, path: "productNumber" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faSignature} />NAVN</>, path: "name" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faCoins} />PRIS</>, path: "salesPrice", content: (data) => { if (data.salesPrice !== undefined) { return data.salesPrice + " kr."; } else { return ""; } } },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faStream} />ENHED</>, path: "unit", content: (data) => data.unit !== undefined && data.unit !== null ? data.unit.name : '-' },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faStickyNote} />BESKRIVELSE</>, path: "description" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faLayerGroup} />PRODUKTGRUPPE</>, path: "productGroup.productGroupNumber", content: (data) => data.productGroup.productGroupNumber },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faTimes} />TILSTAND</>, path: "barred", content: (data) => data.barred !== undefined ? data.barred === true ? 'Inaktiv' : 'Aktiv' : '-' }];



    renderInvoiceDraftProducts = () => {
        const { currentDraft, products } = this.props;

        return (
            <>
                <br />
                <Table onRowClick={this.handelOnProductRowClick} tableColumns={this.productsColumns} tableData={this.getInvoiceDraftProducts(currentDraft, products)} tableTitle="FAKTURA-PRODUKTER" tableIcon={<span className="inline"><FontAwesomeIcon className="fa-lg mr-2" icon={faCubes} />FAKTURA-PRODUKTER</span>} />
            </>
        );
    }



    // Render ===================================================================================================================================================
    render() {
        const { currentDraft } = this.props;
        if (currentDraft == undefined) return <p>Der er ikke faktura med ID: {currentDraft.draftInvoiceNumber}</p>;

        return (
            <>
                {this.renderInvoiceDraftInfoSectionCustomer()}
                {this.renderInvoiceDraftInfoSection()}
                {this.renderInvoiceDraftProducts()}
            </>
        );
    }
}
const mapStateToProps = state => ({
    customers: state.customers.list,
    products: state.products.list,
    Users: state.users
});
export default connect(mapStateToProps)(InvoiceDraftInfo);




