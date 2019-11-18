import React, { Component } from 'react'
import '../../App.css'
import { Redirect } from 'react-router'
import constants from '../../utils/constants'
import axios from 'axios'

class Landing extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loginId: "",
            password: "",
            errMsg: ""
        }
    }

    IsValueEmpty = (Value) => {
        if ("".localeCompare(Value.replace(/\s/g, "")) == 0)
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
                .catch((err) => {
                    this.setState({
                        errMsg: "response.data"
                    })
                })

        }
    }

    render() {
        let redirectVar = null
        if (this.state.errMsg.localeCompare("") != 0) {
            redirectVar = <Redirect to="/login" />
        } else if (localStorage.getItem('twitterToken')) {
            redirectVar = <Redirect to="/user/home" />
        }
        return (
            <div className="row max-height">
                {redirectVar}
                <div className="col-md-6 bg-primary">
                    <div className="row h-100">
                        <div className="col-md-12 align-self-center ml-5 text-white">
                            <h3><i class="fas fa-search"></i> Follow your interests.</h3>
                            <h3><i class="fas fa-users"></i> Hear what people are talking about.</h3>
                            <h3><i class="fas fa-comment"></i> Join the conversation.</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 pt-5">
                    <form onSubmit={this.submitLogin}>
                        <div className="row">
                            <div className="col-md-4 offset-md-1">
                                <input type="text" placeholder="Phone, email or username" className="form form-control" onChange={this.loginIdChangeHandler} value={this.state.loginId}></input>
                            </div>
                            <div className="col-md-4">
                                <input type="password" placeholder="Password" className="form form-control" onChange={this.passwordChangeHandler} value={this.state.password}></input>
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-outline-primary" type="submit">Log in</button>
                            </div>
                        </div>
                    </form>

                    <div className="row">
                        <div className=" col-md-6 offset-md-3 pt-5 mt-5 w-50">
                            <h3 className="font-weight-bolder">See what’s happening in the world right now</h3>
                            <h5 className="font-weight-bolder pt-5">Join Twitter today.</h5>
                            <div className="pt-1">
                                <a href="/create-account">
                                    <button className="btn btn-primary form-control">Sign-up</button>
                                </a>
                            </div>
                            <div className="pt-1">
                                <a href="login">
                                    <button className="btn btn-outline-primary form-control">Log in</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export Landing Component
export default Landing