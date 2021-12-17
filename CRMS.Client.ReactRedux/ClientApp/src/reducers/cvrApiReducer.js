import { FETCH_CVR_API_ADDRESS} from '../actions/types';

const initialState = {
    item: '',
    isLoaded: false
};

 
export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_CVR_API_ADDRESS:
            return {
                ...state,
                item: action.payload,
                isLoaded: true
            };

        default:
            return state;
    }
}
