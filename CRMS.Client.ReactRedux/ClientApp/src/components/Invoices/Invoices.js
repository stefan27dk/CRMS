import { faFileInvoice, faInfo, faLink, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { invoiceDraftsColumns } from '../../Definitions/invoiceDraftsDefinitions';
import Table from '../common/Table';

class Invoices extends Component {
    tableHtml = <a className="m-t-b-auto inline" href="https://secure.e-conomic.com/sales/invoicing/invoices" target="_blank"><FontAwesomeIcon className="fa-lg mr-1" icon={faLink} /><FontAwesomeIcon className="fa-lg mr-3 mini-title" icon={faFileInvoice} /></a>;


    handelOnRowClick = (item) => {

        this.props.history.push(`/InvoiceDraft/${item.draftInvoiceNumber}`);
    }


    //   ===================================================================================================================================================
    render() {
        const { invoiceDrafts } = this.props;
        return (
            <>
                <p className="font-weight-bold"><FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faInfo} />Fakturaer - Klader ligger ind ved economics og er ikke de sendte fakturaer!</p>
                <Table onRowClick={this.handelOnRowClick} tableColumns={invoiceDraftsColumns} html={this.tableHtml} tableData={invoiceDrafts} tableTitle="FAKTURAER - KLADDER" tableIcon={<span className="inline"><FontAwesomeIcon className="fa-lg mr-2" icon={faFileInvoice} />FAKTURAER - KLADDER</span>} tableContainerClass={'table-holder-h-fit'} tableId={'invoiceDraftsTable'} />
            </>
        );
    }
}
const mapStateToProps = state => ({

    userState: state.userState.item,
    invoiceDrafts: state.invoiceDrafts.list,
    Users: state.users
});
export default connect(mapStateToProps)(Invoices);




