import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllRoles } from '../../actions/adminActions';
import NotificationMails from './NotificationMails';
import ServerSettings from './ServerSettings';
import Users from './Users/Users';
 
 
    
class Admin extends Component
{

    componentWillMount()
    {
        const { fetchAllRoles } = this.props;
        fetchAllRoles();
    }


    render() {
         
        return (
            <>                                                   
                <Users />  
                <NotificationMails />
                <br />
                <ServerSettings />
            </>
        );
    }
}
const mapStateToProps = state => ({

    userState: state.userState.item,
    Users: state.users
});
export default connect(mapStateToProps, { fetchAllRoles })(Admin);
 



