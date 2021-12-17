import { FETCH_USERS } from '../actions/types';

const initialState = {
    list: [],
    isLoaded: false
};



export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_USERS:
            return {
                ...state,
                list: action.payload,
                isLoaded: true
            };

        default:
            return state;
    }
}
