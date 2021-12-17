import { FETCH_CUSTOMER_CONTACTPERSONS } from '../actions/types';

const initialState = {
    list: [],
    isLoaded: false
};


 
export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_CUSTOMER_CONTACTPERSONS:
            return {
                ...state,
                list: action.payload,
                isLoaded: true
            };

        default:
            return state;
    }
}
