import { combineReducers } from 'redux';
import customersReducer from './customersReducer';
import customerReducer from './customerReducer';
import productsReducer from './productsReducer';
import productReducer from './productReducer';
import subscriptionsReducer from './subscriptionsReducer';
import messageReducer from './messageReducer';
import customerDomainsReducer from './customerDomainsReducer';
import domainsReducer from './domainsReducer';
import customerContactPersonsReducer from './customerContactPersonsReducer';
import productGroupsReducer from './productGroupsReducer';
import identityUserStateReducer from './identityUserStateReducer';
import usersReducer from './usersReducer';
import usersWithRolesReducer from './usersWithRolesReducer';
import rolesReducer from './rolesReducer';
import dbConnectionStringReducer from './dbConnectionStringReducer';
import notificationMailsReducer from './notificationMailsReducer';
import invoiceDraftsReducer from './invoiceDraftsReducer';
import invoiceDraftReducer from './invoiceDraftReducer';
import cvrApiReducer from './cvrApiReducer';

export default combineReducers({
    customers: customersReducer,
    customer: customerReducer,
    allDomains: domainsReducer, 
    customerDomains: customerDomainsReducer,
    customerContactPersons: customerContactPersonsReducer,
    products: productsReducer,
    product: productReducer,
    productGroups: productGroupsReducer, 
    subscriptions: subscriptionsReducer,
    message: messageReducer,
    userState: identityUserStateReducer,
    appUsers: usersReducer,
    usersWithRoles: usersWithRolesReducer,
    allRoles: rolesReducer,
    dbConString: dbConnectionStringReducer,
    notificationMails: notificationMailsReducer,
    invoiceDrafts: invoiceDraftsReducer,
    invoiceDraft: invoiceDraftReducer,
    cvrApiAddress: cvrApiReducer 
});