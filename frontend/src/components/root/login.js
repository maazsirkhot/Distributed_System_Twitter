import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../App.css'
import axios from 'axios'
import { Redirect } from 'react-router'
import constants from '../../utils/constants'


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginId: "",
            password: "",
            errMsg: ""
        }
    }

    IsValueEmpty = (Value) => {
        if ("".localeCompare(Value.replace(/\s/g, "")) === 0)
            return true
        return false
    }

    loginIdChangeHandler = (e) => {
        this.setState({
            loginId: e.target.value
        })
    }

    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    submitLogin = (e) => {
        e.preventDefault()
        const data = {
            loginId: this.state.loginId,
            password: this.state.password
        }

        // All validations
        if (this.IsValueEmpty(data.loginId) || this.IsValueEmpty(data.password)) {
            this.setState({
                errMsg: "Fiels cannot be empty"
            })
        } else {

            axios.post(constants.BACKEND_SERVER.URL + "/users/login", data)
                .then((response) => {
                    if (response.status === 200) {
                        localStorage.setItem('twitterToken', response.data.token)
                        localStorage.setItem('userId', response.data._id)
                        localStorage.setItem('userName', response.data.userName)
                        localStorage.setItem('name', response.data.name)
                        if (response.data.imageURL) {
                            localStorage.setItem('imageURL', response.data.imageURL)
                        } else {
                            localStorage.setItem('imageURL', "https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png")
                        }
                    }
                    this.setState({
                        loginId: "",
                        password: ""
                    })
                })
                .catch(err => {
                    this.setState({
                        errMsg: "Failed to login"
                    })
                })

        }
    }

    render() {

        let redirectVar = null;
        if (localStorage.getItem('twitterToken')) {
            redirectVar = <Redirect to="/user/home" />
        }

        return (
            <div>
                {redirectVar}
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-4 offset-md-4 mt-5 p-5 shadow">
                            <h1 className="text-center text-primary"><i class="fab fa-twitter"></i></h1>
                            <h5 className="text-center font-weight-bolder">Login to Twitter</h5>
                            <div class="mt-3">
                                <div class="form-group">
                                    <label for="userLoginID">Phone, email, or username</label>
                                    <input type="text" id="userLoginID" onChange={this.loginIdChangeHandler} value={this.state.loginId} class="form-control" required></input>
                                </div>
                                <div class="form-group">
                                    <label for="userPassword">Password</label>
                                    <input type="password" id="userPassword" onChange={this.passwordChangeHandler} value={this.state.password} class="form-control" required></input>
                                </div>
                                <div class="text-center">
                                    <p class="text-danger"> {this.state.errMsg} </p>
                                </div>
                                <div class="form-group">
                                    <input type="submit" id="userLogin" onClick={this.submitLogin} class="form-control bg-primary text-white" value="Login"></input>
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