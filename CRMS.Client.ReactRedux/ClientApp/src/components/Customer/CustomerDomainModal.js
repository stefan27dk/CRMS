import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackspace, faEdit, faGlobe, faPen, faPlug, faPlus, faSave, faTimesCircle, faTrashAlt, faUndoAlt } from '@fortawesome/free-solid-svg-icons';
import { addDomain, deleteDomain, updateDomain } from '../../actions/domainsActions';
import { alertMessage } from '../../actions/messageActions';
import * as moment from 'moment';
import { validateDomain } from '../../Logic/validationLogic';
import { colorRed, colorWhite } from '../../Definitions/commonDefinitions';
import store from '../../store';
import { MESSAGE_TYPE } from '../../actions/types';

class CustomerDomainModal extends Component {

    state = {
        newDomain: "",
        addNewIsValid: false,
        domainModal: false,
        editDomain: [], //Array with domainIDs
        randomForceUpdate:"",
    }

    toggleDomainModal = () => {

        if(!this.state.domainModal){
            this.setState({
                domainModal: !this.state.domainModal, domainList: null
            });
        
        }else{
            this.setState({
                domainModal: !this.state.domainModal
            });
        }
    }


    componentDidUpdate(prevProps, prevState) {
        if(this.state.domainList === null){
            this.setState({
                domainList: !this.state.domains
            });
        }
    }



    forceUpdate = () => {
        this.setState({ randomForceUpdate: moment().add(3, 'seconds').valueOf() });
    }


    onCurrentInputChange = (e) =>
    {
        this.setState({ currentInputNewDomain: e.currentTarget.value});
    }



    handleChangeNewDomain = (event) => {
        const { name, value } = event.target;    
        const addNewIsValid = validateDomain(value);

        if (addNewIsValid == false)
        {
            event.target.style.backgroundColor = colorRed;
        }
        else
        {
            event.target.style.backgroundColor = colorWhite;
        }
        this.setState({ [name]: value, addNewIsValid });
    }



    newDomainSetState = () =>
    {
        this.setState({ newDomain: "" });   
    }



    // Add Customer Domain =============================================================================================================
    addCustomerDomain = (e) =>
    {
        e.preventDefault();
        const { customer } = this.props;
        const { newDomain, addNewIsValid } = this.state;

        if (newDomain !== "" && addNewIsValid)
        {
            // Dispatch - Loading -------------------------
            store.dispatch({
                type: MESSAGE_TYPE,
                payload:
                {
                    messageType: 'loading',
                    messageContent: `Tilføjer Domæne ${newDomain} til Kunde: ${customer.name} - Vent venligst!`,
                    time: moment().add(3, 'seconds').valueOf()
                }
            });
            let domainToAdd = { id: 0, customerId: customer.customerNumber, domainName: newDomain };
            this.props.addDomain(domainToAdd, this.newDomainSetState);
        }
        else
        {
            this.setState({addNewError: true})
        }
    }


    
    // Delete Customer Domain ============================================================================================================= 
    deleteCustomerDomain = (domain) => {
        let result = window.confirm(`Vil du slette denne domain - ${domain.domainName} ?`);

        const {subscriptions, alertMessage } = this.props;
        if (result) {
            // If subscription uses this domain prevent deletion
            let subscriptionWithThisDomain = subscriptions.filter(s => s.domainId == domain.id);
            if (subscriptionWithThisDomain.length === 0) {
                this.props.deleteDomain(domain, this.forceUpdate);
            }
            else
            {
                alertMessage('error', 'Der er abonnement der bruger denne domain!');
            }
        }

    }







    render() {
        const { customer, updateDomain } = this.props;
        const { domainModal, newDomain, addNewIsValid} = this.state;

        return (
            <>
                <span onClick={this.toggleDomainModal} className="ico-dark right-icon no-select mr-4 ml-2">Rediger Domæner<FontAwesomeIcon className="fa-lg ml-3" icon={faGlobe} /><FontAwesomeIcon className="fa-lg mr-2 mini-title" icon={faPen} /></span>
                <Modal backdropTransition={{ timeout: 0 }} modalTransition={{ timeout: 0 }} fade={false} isOpen={domainModal} size="xl" toggle={this.toggleDomainModal}>
                    <ModalHeader toggle={this.toggleDomainModal}><span className="title"><FontAwesomeIcon className="fa-lg" icon={faGlobe} /><FontAwesomeIcon className="fa-lg mr-2 mini-title" icon={faPen} />Rediger domæner:</span></ModalHeader>
                    <ModalBody>
                        <h2 className="inline">{customer.name}</h2>

                      

                        {/* Add New Domain -------------*/}
                        <div className="inline">
                        <div>
                                <p className="h6 title"><FontAwesomeIcon className="fa-lg mini-title mr-1" icon={faPlus} /><FontAwesomeIcon className="fa-lg mr-2" icon={faGlobe} />Tilføj Ny domæne</p>
                           <div className="mt-2 inline">
                                   <form className="d-flex flex-row fit-content-w" onSubmit={this.addCustomerDomain}>
                                        <input className={`form-control input ${addNewIsValid ? 'is-valid' : 'is-invalid'}`} onChange={this.handleChangeNewDomain} name="newDomain" value={newDomain} type="text" />
                                        <span onClick={() => this.setState({ newDomain: '', addNewIsValid: false })} className="red-t no-select m-t-b-auto ml-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faTimesCircle} /></span>
                                       <button type="submit" className="btn btn-success ml-2 py-1" >Tilføj</button>
                                   </form>
                           </div>
                        </div>
                        </div>

                          <hr/>

                        {/*Customer - Domains -------------*/}
                        <div className="inline">
                        <div className="p-2 inline-block mt-3 m-l-r-auto">
                                <p className="m-0 bo-500 no-wrap title mb-2 line-d-t pb-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faGlobe} />DOMÆNER: <sup className="mini-title">{customer.domains.length}</sup></p>
                            {customer.domains.map((domain, index) =>
                            {
                                return <div key={domain.id} className="mb-2 line-t inline-row">
                                    <div className="pb-2">
                                        <span className="mr-1 font-weight-bold">{index+1}</span>
                                        <span className="mr-2 marker">•</span>
                                        <button className="btn btn-danger float-right ml-2 mt-1" onClick={() => this.deleteCustomerDomain(domain)} ><FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faTrashAlt} /></button>
                                        <EditDomain domain={domain} updateDomain={updateDomain} />
                                    </div>
                                </div>;
                            })}
                        </div>    
                        </div>    
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}













class EditDomain extends Component {

    state = {
        editable: false,
        editDomainIsValid: true,
        domainName: "",
    }
          

    componentDidMount()
    {
        this.setState({ domainName: this.props.domain.domainName })
    }

    edit = () =>
    {
        this.setState(state => ({ editable: !state.editable, domainName: this.props.domain.domainName}))
    }



    handleChangeDomain = (event) =>
    {   
        const { name, value } = event.target;
        const { domainName } = this.state;
        const currentIsValid = validateDomain(value);

        if (currentIsValid == false)
        {
            event.target.style.backgroundColor = colorRed;
        }
        else
        {
            event.target.style.backgroundColor = colorWhite;
        }
        this.setState({ domainName: value, editDomainIsValid: currentIsValid});
    }




    updateCustomerDomain = (e) => {
        e.preventDefault();
        const { domainName} = this.state;
        const { domain, updateDomain } = this.props;

        if (domainName !== e.currentTarget[0].name && validateDomain(domainName) == true)
        {
            // Dispatch - Loading -------------------------
            store.dispatch({
                type: MESSAGE_TYPE,
                payload:
                {
                    messageType: 'loading',
                    messageContent: `Opdater Domæne ${domainName} - Vent venligst!`,
                    time: moment().add(3, 'seconds').valueOf()
                }
            });
           let domainObj = { id: domain.id, domainName: domainName, customerId: domain.customerId }
           updateDomain(domainObj, this.setStateEditable);
        }
    }


    setStateEditable  = () => {
        this.setState({ editable: false });
    }

    render() {
        const { domain } = this.props;
        const { editable, domainName, editDomainIsValid } = this.state;
        if (editable)
        {
            return <form className="inline-row" onSubmit={this.updateCustomerDomain}>
                <div className="inline ml-2">
                <input className={`form-control input ${editDomainIsValid ? "is-valid" : "is-invalid"}`} name={domain.domainName} defaultValue={domainName} onChange={this.handleChangeDomain} />
                <button className="btn btn-primary ml-2" type="submit" ><FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faSave} /></button>
                <button className="btn btn-warning ml-2" onClick={this.edit} ><FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faUndoAlt} /></button>
                    </div>
            </form>

        }
        else
        {
            return <>
                <a className="mr-3" href={"http://" + domainName} target="_blank" >{domainName}</a>
                <button className=" btn btn-primary ml-2 mt-1 flex-right" onClick={this.edit} ><FontAwesomeIcon className="fa-lg ml-3 mr-2" icon={faPen} /></button>
             </>
        }


    }

}

const mapStateToProps = state => ({                                          
    //domains: state.customerDomains.list
    subscriptions: state.subscriptions.list
    });

export default connect(mapStateToProps, { addDomain, deleteDomain, alertMessage, updateDomain })(CustomerDomainModal);
