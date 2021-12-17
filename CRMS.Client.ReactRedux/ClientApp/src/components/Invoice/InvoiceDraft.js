import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import InvoiceDraftInfo from './InvoiceDraftInfo';

class InvoiceDraft extends Component {


    // Render ===================================================================================================================================================
    render() {
        let currentDraft = this.props.invoiceDrafts.find(i => i.draftInvoiceNumber == this.props.match.params.Id);
        if (currentDraft == undefined) return <p>Loader...</p>;

        return (
            <>
                <InvoiceDraftInfo currentDraft={currentDraft} history={this.props.history} />
            </>
        );
    }
}
const mapStateToProps = state => ({

    userState: state.userState.item,
    invoiceDrafts: state.invoiceDrafts.list,
    Users: state.users
});
export default connect(mapStateToProps)(InvoiceDraft);




