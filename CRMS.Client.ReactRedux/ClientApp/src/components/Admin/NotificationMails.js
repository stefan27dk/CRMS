import { faAt, faHashtag, faPlus, faToolbox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { addNotificationMail, deleteNotificationMail, fetchAllNotificationMails, fetchDbConnectionstring } from '../../actions/adminActions';
import { MESSAGE_TYPE } from '../../actions/types';
import { blueButtonSmall, colorRed, colorWhite, deleteButtonHtml } from '../../Definitions/commonDefinitions';
import { validateEmail } from '../../Logic/validationLogic';
import store from '../../store';
import Table from '../common/Table';


class NotificationMails extends Component {

    state = {
        emailToAdd: ""
    };

    componentWillMount() {
        const { fetchAllNotificationMails } = this.props;
        fetchAllNotificationMails();
    }


    notificationMailsColumns = [
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faHashtag} />ID</>, path: "id" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faAt} />EMAIL</>, path: "email" },
        { title: <><FontAwesomeIcon className="fa-lg mr-2" icon={faToolbox} />FUNKTIONER</>, path: "", content: (data) => this.mailFunctions(data) }
    ];


    mailFunctions = (data) => {
        return deleteButtonHtml(this.deleteMail, data);
    }


    deleteMail = (data) => {
        let result = window.confirm(`Vil du slette Notificering Mail - ${data.email} ?`);
        if (result) {
            const { deleteNotificationMail } = this.props;
            deleteNotificationMail(data.email);
        }
    }


    notificationTableHtml = () => {
        const { emailToAdd } = this.state;
        return <div className="inline m-l-auto"><div className="m-l-auto inline"><FontAwesomeIcon className="fa-lg mr-2" icon={faAt} /><input ref={this.addMailInputRef} placeholder="Tilføj Email..." className="input-default" name="emailToAdd" value={emailToAdd} onChange={this.addMailHandleChange} type="text" />{blueButtonSmall(this.addNotificationMailSend, <span><FontAwesomeIcon className="fa-lg mr-2" icon={faPlus} /> Tilføj</span>, "button")}</div></div>;
    }

    addMailInputRef = React.createRef();
    addMailButtonBlock = { block: false };

    addNotificationMailSend = () => {
        const { addNotificationMail } = this.props;
        const { emailToAdd } = this.state;

        if (validateEmail(emailToAdd) == true && this.addMailButtonBlock.block == false) {
            // Dispatch - Loading -------------------------
            store.dispatch({
                type: MESSAGE_TYPE,
                payload:
                {
                    messageType: 'loading',
                    messageContent: `Tilføjer Email: ${emailToAdd} - Vent venligst!`,
                    time: moment().add(3, 'seconds').valueOf()
                }
            });
            this.addMailInputRef.current.style.backgroundColor = colorWhite;
            this.addMailButtonBlock.bock = true;
            addNotificationMail(emailToAdd, this.emailToAddResetState, this.addMailButtonBlock);
        }
        else {
            this.addMailInputRef.current.style.backgroundColor = colorRed;
        }
    }


    addMailHandleChange = (e) => {
        if (validateEmail(e.currentTarget.value) == true) {
            e.currentTarget.style.backgroundColor = colorWhite;

        }
        else {
            e.currentTarget.style.backgroundColor = colorRed;
        }
        this.setState({ emailToAdd: e.currentTarget.value });
    }


    emailToAddResetState = () => {
        this.setState({ emailToAdd: "" });
    }

    // Render ===================================================================================================================================================
    render() {
        const { notificationMails } = this.props;
        return (
            <div className="table-container table-responsive subDiv">
                <Table className="my-5" tableColumns={this.notificationMailsColumns} tableData={notificationMails} html={this.notificationTableHtml()} tableTitle="NOTIFICERING MAILS" tableIcon={<span className="ml-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faAt} /> NOTIFICERING MAILS </span>} tableContainerClass={'table-holder-h-fit'} tableId={'notificationMailsTable'} excelFilter={'removeLastColumn'} />
            </div>
        );
    }
}
const mapStateToProps = state => ({

    userState: state.userState.item,
    notificationMails: state.notificationMails.list,
    Users: state.users
});
export default connect(mapStateToProps, { fetchAllNotificationMails, deleteNotificationMail, addNotificationMail })(NotificationMails);




