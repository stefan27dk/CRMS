import { FETCH_CUSTOMER_DOMAINS } from '../actions/types';

const initialState = {
    list: [],
    isLoaded: false
};


 
export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_CUSTOMER_DOMAINS:
            return {
                ...state,
                list: action.payload,
                isLoaded: true
            };

        default:
            return state;
    }
}
