import { MESSAGE_TYPE } from '../actions/types';

const initialState = {
    messageType: "",
    messageContent: "",
};



export default function (state = initialState, action) {
    switch (action.type) {
        case MESSAGE_TYPE:
            return {
                ...state,
                ...action.payload
            };

        default:
            return state;
    }
}
