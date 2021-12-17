import { FETCH_DB_CONNECTION_STRING} from '../actions/types';

const initialState = {
    item: {},
    isLoaded: false
};


 
export default function (state = initialState, action) {
    switch (action.type)
    {
        case FETCH_DB_CONNECTION_STRING:
            return {
                ...state,
                item: action.payload,
                isLoaded: true
            };

        default:
            return state;
    }
}
