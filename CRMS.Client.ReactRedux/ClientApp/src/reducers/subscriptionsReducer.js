import _ from 'lodash';
import { FETCH_SUBSCRIPTIONS } from '../actions/types';
import { UPDATE_SUBSCRIPTIONS } from '../actions/types';

const initialState = {
    list: [],
    isLoaded: false
};




export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_SUBSCRIPTIONS:
            return {
                ...state,
                list: action.payload,
                isLoaded: true
            };

        case UPDATE_SUBSCRIPTIONS:
            return {
                ...state,
                list: action.payload,
                isLoaded: true
            };

        default:
            return state;
    }
}