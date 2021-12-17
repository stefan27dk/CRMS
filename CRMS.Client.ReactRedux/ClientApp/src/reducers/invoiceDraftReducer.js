import { INVOICE_DRAFT } from '../actions/types';

const initialState = {
    item: {},
    isLoaded: false
};


 
export default function (state = initialState, action) {
    switch (action.type)
    {
        case INVOICE_DRAFT:
            return {
                ...state,
                item: action.payload,
                isLoaded: true
            };

        default:
            return state;
    }
}
