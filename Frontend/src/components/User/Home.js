import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';


class UserHome extends Component {

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
            
            // Call UserHome API

        }
    }

    render(){
        
        return(
            <div className="row" style={{ minHeight: 100 + "vh" }}>
                <div className="col-md-3 offset-md-1 pl-5 pr-5">
                    
                    <div className="row text-primary mt-3 mb-3">
                        <div className="col-md-2"><h1><i class="fab fa-twitter"></i></h1></div>
                    </div>

                    <div className="row text-primary mt-3 mb-3">
                        <div className="col-md-2"><h4><i class="fas fa-home"></i></h4></div>
                        <div className="col-md-10"><h4 className="font-weight-bolder">Home</h4></div>
                    </div>

                    <div className="row mt-3 mb-3">
                        <div className="col-md-2"><h4><i class="fas fa-hashtag"></i></h4></div>
                        <div className="col-md-10"><h4 className="font-weight-bolder">Explore</h4></div>
                    </div>

                    <div className="row mt-3 mb-3">
                        <div className="col-md-2"><h4><i class="fas fa-envelope"></i></h4></div>
                        <div className="col-md-10"><h4 className="font-weight-bolder">Messages</h4></div>
                    </div>

                    <div className="row mt-3 mb-3">
                        <div className="col-md-2"><h4><i class="fas fa-bookmark"></i></h4></div>
                        <div className="col-md-10"><h4 className="font-weight-bolder">Bookmarks</h4></div>
                    </div>

                    <div className="row mt-3 mb-3">
                        <div className="col-md-2"><h4><i class="fas fa-list-alt"></i></h4></div>
                        <div className="col-md-10"><h4 className="font-weight-bolder">Lists</h4></div>
                    </div>

                    <div className="row mt-3 mb-3">
                        <div className="col-md-2"><h4><i class="fas fa-user-alt"></i></h4></div>
                        <div className="col-md-10"><h4 className="font-weight-bolder">Profile</h4></div>
                    </div>

                    <div className="row mt-3 mb-3">
                        <div className="col-md-2"><h4><i class="fas fa-chart-bar"></i></h4></div>
                        <div className="col-md-10"><h4 className="font-weight-bolder">Analytics</h4></div>
                    </div>
                    
                    <input type="text" placeholder="Search" className="form-control"/>
                </div>

                <div className="col-md-8 shadow p-5">
                    <div>
                        <div className="row">
                            <div className="col-md-1">
                                <h4><i class="fas fa-user-alt"></i></h4>
                            </div>
                            <div className="col-md-11">
                                <textarea rows="5" style={{ resize : "none", width : 100 + "%", border : "none" }} placeholder="What's happening?" />
                            </div>

                        </div>
                        
                        <div className="text-right">0/280 | <button className="btn btn-primary">Tweet</button></div>
                    </div>
                </div>

            </div>
        )
    }
}
//export UserHome Component
export default UserHome;