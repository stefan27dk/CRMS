import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { fetchDbConnectionstring, updateConnectionString } from '../../actions/adminActions';
import { blueButtonSmall } from '../../Definitions/commonDefinitions';
import NotificationMails from './NotificationMails';
     
class ServerSettings extends Component
{
    state = {conStringToUpdate: ""};

    componentWillReceiveProps(nextProps)
    {        
        this.setState({ conStringToUpdate: nextProps.dbConString.conString });
    }

    componentWillMount()
    {
        const { fetchDbConnectionstring } = this.props;
        fetchDbConnectionstring(); 
    }


    updateConnectionstringSend = () =>
    {
        // Confirm message
        const { conStringToUpdate } = this.state;
        const { updateConnectionString } = this.props;
        updateConnectionString(conStringToUpdate, this.resetStateconStringToUpdate);
    }


    handleOnCHangeConString = (e) =>
    {
        this.setState({ conStringToUpdate: e.currentTarget.value});
    }


    resetStateconStringToUpdate = () =>
    {
        this.setState({ conStringToUpdate: ""});
    }

    // Render ===================================================================================================================================================
    render() {
        const { conStringToUpdate } = this.state;
        return (
            <>   
                <div className="table-container table-responsive subDiv margin-y-25px">
                    <div className="d-flex flex-row flex-wrap">
                        <p className="h2 p-2 fit-content-w autoResizeFont-big">Database Connection String</p>
                        <div className="inline-lr">
                            <input name="conString" className="w-100 ml-1 mr-1" value={conStringToUpdate} placeholder="DB Connection String...." onChange={this.handleOnCHangeConString}/>
                            {blueButtonSmall(()=> this.updateConnectionstringSend(), "Opdater", "button")}
                              </div>
                          <label className="autoResizeFont-s ml-1 mr-1" htmlFor="conString">Ex: Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=ItlCrmsDb;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False</label>
                    </div>  
                </div>
                <br/>
                <div className="margin-y-25px">
                    <span className="h2 p-2 fit-content-w autoResizeFont-big">API</span> <a className="btn btn-success mr-1 mb-2 max-heigh-35px" href="/swagger/index.html" target="_blank">Åben i ny fane</a>
                    <iframe src="/swagger/index.html" height="1000" width="100%" title="Iframe Example"></iframe>
                </div>
            </>
        );
    }
}
const mapStateToProps = state => ({

    userState: state.userState.item,
    dbConString: state.dbConString.item,
    Users: state.users
});
export default connect(mapStateToProps, { fetchDbConnectionstring, updateConnectionString})(ServerSettings);
 



