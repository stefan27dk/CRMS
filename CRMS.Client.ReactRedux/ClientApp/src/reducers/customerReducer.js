import { FETCH_CUSTOMER} from '../actions/types';

const initialState = {
    item: {},
    isLoaded: false
};

 
export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_CUSTOMER:
            return {
                ...state,
                item: action.payload,
                isLoaded: true
            };

        default:
            return state;
    }
}
