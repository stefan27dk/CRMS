import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDatabase, faFileInvoice, fas, faUserPlus} from '@fortawesome/free-solid-svg-icons'
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { createAndSendInvoiceDrafts } from '../../actions/invoiceDraftActions';

import { connect } from 'react-redux';

/*import { useRef } from 'react';*/
    
class FixedMiniMenu extends Component
{
    // Props
    isWorking = { working: false};


    // Component Did mount ========================================================================================================================================================
    componentDidMount()
    {
       
    }

     

    // Customer - Create - page =========================================================================================================================================
    createCustomer = () => {

    }



    // sendDraftInvoices =========================================================================================================================================
    sendDraftInvoices = () =>
    {
        if (this.isWorking.working === false)
        {
            console.log("Clicked");
            this.isWorking.working = true;
            this.props.createAndSendInvoiceDrafts(this.isWorking);
        }
    }
 
    


    // Render ===========================================================================================================================================================
    render()
    {
        return (
            <div className="fixed-mini-menu no-select">
                <span onClick={this.sendDraftInvoices}>SEND FAKTURA <FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faFileInvoice} /></span>
            </div>);
    }


}



// Map STATE to Props ==============================================================================================================================
const mapStateToProps = state => ({

    messageType: state.message.messageType,
    messageContent: state.message.messageContent,
    Users: state.users
});
 
export default connect(mapStateToProps, { createAndSendInvoiceDrafts } )(FixedMiniMenu);









     
                     