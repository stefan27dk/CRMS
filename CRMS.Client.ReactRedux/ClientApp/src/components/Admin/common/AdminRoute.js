import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Admin from '../Admin';
    
class AdminRoute extends Component
{
    // Render ===================================================================================================================================================


    render() {
        const { component: Component, path, userState } = this.props;      
        let adminRole = userState.roles.find(r => r == 'admin');
        return (
            
            <Route path={path} render={(props) => (userState.isLoggedIn == true && adminRole !== undefined ?
                (<Component {...props} />) : (<Redirect to={"/"} />))} />
        );
    }
}
const mapStateToProps = state => ({

    userState: state.userState.item,
    Users: state.users
});
export default connect(mapStateToProps)(AdminRoute);
 



