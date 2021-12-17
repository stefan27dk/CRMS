import React, { Component } from 'react';
import { connect } from 'react-redux';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import loading from '../../app-img/loading.gif';


class Message extends Component {

   isLoading = false;


    // Component Did Mount ===================================================================================================================================================
    componentDidMount() {
    }




    // Component Did Update ===================================================================================================================================================
    componentDidUpdate() {

    }





    // Show Loading Message ===================================================================================================================================================
    loading = () =>
    {
        return (<div className="msg-container msg-loading"><img className="loading-ico" alt="loading" src={loading} /><p className="loading-text">{this.props.message.messageContent}</p></div>);
    }





    // Render ===================================================================================================================================================
    render() {

        const { message } = this.props;

        // Loading
        if (message.messageType === 'loading' && this.isLoading !== true)
        {
            toast.dismiss();
            this.isLoading = true;
            toast.loading(message.messageContent);
        }
        // Success
        else if (message.messageType === 'success')
        {
            toast.dismiss();
            this.isLoading = false;
            toast.success(message.messageContent);
        }
        // Warning
        else if (message.messageType === 'warning')
        {
            toast.dismiss();
            this.isLoading = false;
            toast.warn(message.messageContent);
        }
        // Error
        else if (message.messageType === 'error')
        {
            toast.dismiss();
            this.isLoading = false;
            toast.error(message.messageContent);
        }



        return (
            <>
                
                <ToastContainer position="top-center" />
            </>
        );
    }
}

//{ this.isLoading === true ? toast.loading(message.messageContent) : '' }
const mapStateToProps = state => ({
    message: state.message,
});

export default connect(mapStateToProps, {})(Message);




