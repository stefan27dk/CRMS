import { FETCH_CUSTOMERS, UPDATE_CUSTOMER_DOMAIN, ADD_CUSTOMER_DOMAIN, DELETE_CUSTOMER_DOMAIN } from '../actions/types';

const initialState = {
    list: [],
    isLoaded: false
};



export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_CUSTOMERS: {
            return {
                ...state,
                list: action.payload,
                isLoaded: true
            };
        }

        case DELETE_CUSTOMER_DOMAIN: {
            let listToUpdate = [...state.list];
            let customer = listToUpdate.find(c => c.customerNumber == action.payload.customerId);
            //customer.domains = customer.domains.find( d => d.domainName != action.payload.domainName);
            var domainToDeleteIndex = customer.domains.indexOf(action.payload);
            if (domainToDeleteIndex > -1) {
                customer.domains.splice(domainToDeleteIndex, 1);
            }

            return {
                ...state,
                list: listToUpdate,
                isLoaded: true
            };
        } break;

        case ADD_CUSTOMER_DOMAIN: {
            let listToUpdate = [...state.list];
            let customer = listToUpdate.find(c => c.customerNumber == action.payload.customerId);
            customer.domains.push(action.payload);

            return {
                ...state,
                list: listToUpdate,
                isLoaded: true
            };
        } break;




        case UPDATE_CUSTOMER_DOMAIN: {
            let listToUpdate = [...state.list];
            let customer = listToUpdate.find(c => c.customerNumber == action.payload.customerId);

            const domainToUpdateIndex = customer.domains.findIndex(item => item.id == action.payload.id);
            if (domainToUpdateIndex > -1)
            {
                customer.domains[domainToUpdateIndex].domainName = action.payload.domainName;
            }

            return {
                ...state,
                list: listToUpdate,
                isLoaded: true
            };
        } break;
           
        //case "UPDATE_DOMAIN_ON_CUSTOME":

        //    //state.list = customers List

        //    //var domain = state.list.find(x => x.customerId== action.payload.CustomerId).domains.find(x=> x.Id == action.Payload.Id)
        //    //update foundDomain

        //    //domain = action.Payload;

        //    return {
        //        ...state,
        //        isLoaded: true
        //    };  
        default:
            return state;
    }
}
