import { DELETE_USER_STATE, USER_STATE} from '../actions/types';

const initialState = {
    item: {},
    isLoaded: false
};


 
export default function (state = initialState, action) {
    switch (action.type)
    {
        case USER_STATE:
            return {
                ...state,
                item: action.payload,
                isLoaded: true
            };

        case DELETE_USER_STATE:
            return initialState;

        default:
            return state;
    }
}
