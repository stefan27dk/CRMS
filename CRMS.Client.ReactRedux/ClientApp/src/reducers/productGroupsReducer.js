import { FETCH_PRODUCT_GROUPS } from '../actions/types';

const initialState = {
    list: [],
    isLoaded: false
};



export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_PRODUCT_GROUPS:
            return {
                ...state,
                list: action.payload,
                isLoaded: true
            };

        default:
            return state;
    }
}
