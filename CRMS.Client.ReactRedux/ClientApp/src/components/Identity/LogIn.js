import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
/*import { createHashHistory } from 'history'*/
import { createBrowserHistory } from 'history';
import { isUserLoggedIn } from '../../Definitions/commonDefinitions';
import { logIn } from '../../actions/identityActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faBookmark, faKey, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

class LogIn extends Component {
    state = { currentLogIn: { rememberMe: false } }

    passwordInput = React.createRef();

    handleChangeLogin = (e) => {
        const { currentLogIn } = this.state;
        let logInObj = {};

        if (e.target.name === 'rememberMe') {
            logInObj = { ...currentLogIn, rememberMe: e.target.checked };
        }
        else {
            logInObj = { ...currentLogIn, [e.target.name]: e.target.value };
        }
        this.setState({ currentLogIn: logInObj });
    }



    handleLogIn = () => {
        const { logIn, history, location } = this.props;
        const { currentLogIn } = this.state;
        logIn(currentLogIn, history, location.state === undefined ? '/' : location.state.originPath);
    }



    toggleShowPassword = () => {
        if (this.passwordInput.current.type == "text") {
            this.passwordInput.current.type = "password";
        }
        else {
            this.passwordInput.current.type = "text";
        }
    }




    render() {
        return (
            <>
                <div className="login-container"></div>
                <div className="middle-inputContainer z-index-100">
                    <h3 className="title inline">Login</h3>
                    <hr className="p-0 mt-1 mb-3" />
                    <div className="inline"><img className="login-logo" alt="logo" src="/img/itl-crms-logo.png" /></div>
                    <hr className="p-0 mt-1 mb-3" />

                    <div className="colom">
                        <div className="form-group">
                            <label className="my-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faAt} />Email:</label>
                            <input placeholder="Email..." name="email" type="text" maxLength="25" id="emailLogin" className="form-control inputDark" onChange={this.handleChangeLogin} />
                        </div>

                        <div className="form-group">
                            <label className="my-2"><FontAwesomeIcon className="fa-lg mr-2" icon={faKey} />Adgangskode: </label> <input onClick={this.toggleShowPassword} name="showHidePass" value="true" type="checkbox" id="showHidePassLogin" />
                            <input ref={this.passwordInput} placeholder="Adgangskode..." name="password" type="password" minLength="6" maxLength="40" id="passwordLogin" className="form-control inputDark" onChange={this.handleChangeLogin} />
                            <label id="passwordValidationLogIn"></label>
                        </div>

                        <div className="form-group">
                            <label className="subTitle inline"><FontAwesomeIcon className="fa-lg mr-2" icon={faBookmark} />Husk Mig:</label>
                            <input name="rememberMe" value="true" type="checkbox" id="rememberMe" className="form-control" onChange={this.handleChangeLogin} />
                        </div>
                        <div className="inline">
                            <button className="btn btn-primary m-t-b-auto text-nowrap my-2" onClick={this.handleLogIn}><FontAwesomeIcon className="fa-lg mr-2" icon={faSignInAlt} />Log Ind</button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    Users: state.users
});

//export default connect(mapStateToProps, { logIn })(LogIn);
export default withRouter(connect(mapStateToProps, { logIn })(LogIn));


