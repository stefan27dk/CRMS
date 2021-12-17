import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
    
class PrivateRoute extends Component
{
    // Render ===================================================================================================================================================
    render() {
        const { component: Component, path, userState } = this.props;      
        return (
            <Route path={path} render={(props) => (userState.isLoggedIn == true ?
                (<Component {...props} />) : (<Redirect to={{ pathname: '/LogIn', state: { originPath: props.location } }} />))} />
        );
    }
}
const mapStateToProps = state => ({

    userState: state.userState.item,
    Users: state.users
});
export default connect(mapStateToProps)(PrivateRoute);
 



