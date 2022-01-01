// React
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Others
import { Layout } from './components/common/Layout';
import './custom.css'

// Components
import Home from './components/Home';
import Customers from './components/Customers/Customers';
import Customer from './components/Customer/Customer';
import Products from './components/Products';
import Product from './components/Product/Product';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import Message from './components/common/Message';
import Subscriptions from './components/Subscriptions/Subscriptions';
import LogIn from './components/Identity/LogIn';
 
import { Redirect, Switch } from 'react-router';
import PrivateRoute from './components/common/PrivateRoute';
import { dispatchAllToReduxStore } from './Definitions/commonDefinitions';
import { loggedIn, logOut } from './actions/identityActions';
import Admin from './components/Admin/Admin';
import AdminRoute from './components/Admin/common/AdminRoute';
import Invoices from './components/Invoices/Invoices';
import InvoiceDraft from './components/Invoice/InvoiceDraft';
 
class App extends Component
{
    state = { logged: undefined}

    componentWillMount()
    {
        this.isLoggedIn();
    }


    isLoggedIn = async () =>
    {
        const isLoggedIn = await loggedIn();
    
        if (isLoggedIn.isLoggedIn == true)
        {
            dispatchAllToReduxStore();       
        }
        this.setState({ logged: isLoggedIn.isLoggedIn });
    }

              
 

    render()
    {
        if (store.getState().userState.item.isLoggedIn == undefined) return '';
        return ( 
            <Provider store={store}>
                <Router>
                    <Layout>
                        <Switch>   
                          <AdminRoute exact path="/Admin" component={Admin} /> 
                           <PrivateRoute exact path="/" component={Home} />
                            <PrivateRoute exact path="/Customers" component={Customers} />
                             <PrivateRoute exact path="/Subscriptions" component={Subscriptions} />
                              <PrivateRoute exact path="/Subscriptions" component={Subscriptions} />
                               <PrivateRoute exact path="/Products" component={Products} />
                                <PrivateRoute exact path="/Invoices" component={Invoices} />
                                 <PrivateRoute exact path="/InvoiceDraft/:Id" component={InvoiceDraft} />
                                  <PrivateRoute exact path="/Product/:Id" component={Product} />
                                   <PrivateRoute exact path="/Customer/:Id" component={Customer} />  
                                    <Route path='/LogIn' render={(props) => (store.getState().userState.item.isLoggedIn == true ? (<Redirect to="/" />) : (<LogIn {...props} />))} />
                                     <Route path='/LogOut' render={(props) => { store.dispatch(logOut(props.history))}} />
                        </Switch>
                   </Layout>
                </Router>
                <Message/>
            </Provider>
        );
    }
} 
export default App;



          