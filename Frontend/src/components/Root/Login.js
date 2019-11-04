import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username : "",
            password : "",
            errMsg : ""
        };
        this.redirectVar = null;
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    }

    IsValueEmpty = (Value) => {
        if ("".localeCompare(Value.replace(/\s/g, "")) == 0) 
            return true;
        return false;
    }

    IsValidEmailID = (EmailID) => {
        if (EmailID.match(/^[a-z][a-z0-9\._]*[@][a-z]+[.][a-z]+$/)) {
            return true;
        }
        return false;
    }

    usernameChangeHandler = (e) => {
        this.setState({
            username : e.target.value
        });
    }

    passwordChangeHandler = (e) => {  
        this.setState({
            password : e.target.value
        });
    }

    submitLogin = (e) => {
        const data = {
            userEmailID : this.state.username,
            userPassword : this.state.password
        }

        // All validations
        if (this.IsValueEmpty(data.userEmailID) || this.IsValueEmpty(data.userPassword)){
            this.setState({
                errMsg : "Fiels cannot be empty"
            })
        } else if(!this.IsValidEmailID(data.userEmailID)){
            this.setState({
                errMsg : "Invalid email ID"
            })
        } else {
            
            // Call login API

        }
    }

    render(){
        
        return(
            <div>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-4 offset-md-4 mt-5 p-5 shadow">
                            <h5 className="text-center font-weight-bolder">Login to Twitter</h5>
                            <div class="mt-3">
                                <div class="form-group">
                                    <label for="userEmailID">Phone, email, or username</label>
                                    <input type="email" id="userEmailID" onChange={ this.usernameChangeHandler } value={ this.state.username } class="form-control" required></input>
                                </div>
                                <div class="form-group">
                                    <label for="userPassword">Password</label>
                                    <input type="password" id="userPassword" onChange={ this.passwordChangeHandler } value={ this.state.password }class="form-control" required></input>
                                </div>
                                <div class="text-center">
                                    <p class="text-danger"> { this.state.errMsg } </p>
                                </div>
                                <div class="form-group">
                                    <input type="submit" id="userLogin" onClick={ this.submitLogin } class="form-control bg-primary text-white" value="Login"></input>
                                </div>
                                <div class="panel text-center">
                                    <p>or</p>
                                    <p><Link to="/create-account">Create account</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export Login Component
export default Login;