import * as moment from 'moment';
import { MESSAGE_TYPE } from './types';



// Message - alert
export const alertMessage = (msgType, msgContent) => dispatch => {

    if (msgType == 'success') {

        // Dispatch - Success Message -------------------------
        dispatch({
            type: MESSAGE_TYPE,
            payload: {
                messageType: msgType,
                messageContent: msgContent,
                time: moment().add(3, 'seconds').valueOf()
            }
        });

    }
    else if (msgType == 'error') // If Error ____________________________________________
    {
        // Dispatch - Error Message -----------------------------
        dispatch({
            type: MESSAGE_TYPE,
            payload:
            {
                messageType: msgType,
                messageContent: msgContent,
                time: moment().add(3, 'seconds').valueOf()
            }
        });
    }
};







