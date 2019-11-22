import React, { Component, isValidElement } from 'react'
import '../../App.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import cookie from 'react-cookies'
import { Redirect } from 'react-router'
import constants from '../../utils/constants'

class CreateAccount extends Component {

    constructor() {
        super()
        this.state = {
            name: "",
            email: "",
            phone: "",
            password: "",
            errMsg: "",
            successMsg: "",
            month: "January",
            date: 1,
            year: 2019,
            showEmail: true
        }
        this.Months = {
            "January": 31,
            "February": 28,
            "March": 31,
            "April": 30,
            "May": 31,
            "June": 31,
            "July": 30,
            "August": 31,
            "September": 30,
            "October": 31,
            "November": 30,
            "December": 31
        }
    }

    IsValueEmpty = (Value) => {
        if (Value == null) {
            return false
        }
        if ("".localeCompare(Value.replace(/\s/g, "")) == 0)
            return true
        return false
    }

    IsValidEmailID = (EmailID) => {
        if (EmailID == null) {
            return true
        }
        if (EmailID.match(/^[a-z][a-z0-9\._]*[@][a-z]+[.][a-z]+$/)) {
            return true
        }
        return false
    }

    IsValidName = (Name) => {
        if (Name.match(/^[a-zA-Z ]+$/)) {
            return true
        }
        return false
    }

    IsValidPassword = (Password) => {
        if (Password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            return true
        }
        return false
    }

    isLeapYear = (year) => {
        return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0)
    }

    nameChangeHandler = (e) => {
        if (e.target.value.length <= 50) {
            this.setState({
                name: e.target.value
            })
        }
    }

    emailChangeHandler = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    phoneChangeHandler = (e) => {
        this.setState({
            phone: e.target.value
        })
    }

    toggleEmailPhone = (e) => {
        this.setState({
            showEmail: !this.state.showEmail
        })
    }

    monthChangeHandler = (e) => {
        this.setState({
            month: e.target.value
        })
    }

    yearChangeHandler = (e) => {
        this.setState({
            year: e.target.value
        })
        this.isLeapYear(e.target.value) ? this.Months['February'] = 29 : this.Months['February'] = 28
    }

    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    submitCreateAccount = (e) => {
        e.preventDefault()
        let usrData = {
            name: this.state.name,
            password: this.state.password,
            dateOfBirth: this.state.month + " " + this.state.date + " " + this.state.year
        }
        this.state.showEmail ? usrData.email = this.state.email : usrData.phone = this.state.phone
        // Check for valid phone number
        if (this.IsValueEmpty(usrData.name) || this.IsValueEmpty(usrData.email) || this.IsValueEmpty(usrData.password) || this.IsValueEmpty(usrData.phone)) {
            this.setState({
                errMsg: "All the fields are required",
                successMsg: ""
            })
        } else if (!this.IsValidEmailID(usrData.email)) {
            this.setState({
                errMsg: "Invalid email ID",
                successMsg: ""
            })
        } else if (!this.IsValidName(usrData.name)) {
            this.setState({
                errMsg: "Name can contain only alphabets and spaces",
                successMsg: ""
            })
        } else if (!this.IsValidPassword(usrData.password)) {
            this.setState({
                errMsg: "Invalid password format",
                successMsg: ""
            })
        } else {
            axios.post(constants.BACKEND_SERVER.URL + "/users/signup", usrData)
                .then((response) => {
                    this.setState({
                        name: "",
                        email: "",
                        phone: "",
                        month: "January",
                        date: 1,
                        year: 2019,
                        password: "",
                    })
                    if (response.status === 201) {
                        this.setState({
                            successMsg: "User created successfully",
                            errMsg: ""
                        })
                    }
                })
                .catch(err => {
                    this.setState({
                        errMsg: "Failed to create account",
                        successMsg: ""
                    })
                })

        }
    }

    render() {

        var MonthsOption = []
        var DateOption = []
        var YearsOption = []
        var toggleMsg = ""
        var EmailOrPhone = []
        if (this.state.showEmail) {
            EmailOrPhone.push(
                <div className="form-group">
                    <label for="userEmailID">Email</label>
                    <input type="email" id="userEmailID" onChange={this.emailChangeHandler} className="form-control" value={this.state.email} required></input>
                </div>
            )
            toggleMsg = "Use phone instead"
        } else {
            EmailOrPhone.push(
                <div className="form-group">
                    <label for="userPhone">Phone</label>
                    <input type="text" id="userPhone" onChange={this.phoneChangeHandler} className="form-control" value={this.state.phone} required></input>
                </div>
            )
            toggleMsg = "Use email instead"
        }
        for (var month in this.Months) {
            MonthsOption.push(<option value={month}>{month}</option>)
        }
        for (var date = 1; date <= this.Months[this.state.month]; date++) {
            DateOption.push(<option value={date}>{date}</option>)
        }
        for (var year = 2019; year >= 1899; year--) {
            YearsOption.push(<option value={year}>{year}</option>)
        }

        let redirectVar = null
        if (localStorage.getItem('twitterToken')) {
            redirectVar = <Redirect to="/user/home" />
        }

        return (
            <div>
                {redirectVar}
                <div className="container-fluid">
                    <form>
                        <div className="row">
                            <div className="col-md-4 offset-md-4 mt-5 pl-5 pr-5 pt-4 pb-4 shadow">
                                <h4 className="font-weight-bolder">Create your account</h4>
                                <div className="form-group">
                                    <label for="userFirstName">Name</label>
                                    <input type="text" id="userName" onChange={this.nameChangeHandler} className="form-control" value={this.state.name} required></input>
                                </div>
                                <div className="text-right">{this.state.name.length}/50</div>
                                {EmailOrPhone}
                                <div className="text-primary form-group" onClick={this.toggleEmailPhone} style={{ cursor: "pointer" }}>{toggleMsg}</div>
                                <div>Date of birth</div>
                                <div className="row form-group">
                                    <div className="col-md-5">
                                        <select className="form-control" onChange={this.monthChangeHandler}>
                                            {MonthsOption}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <select className="form-control">
                                            {DateOption}
                                        </select>
                                    </div>
                                    <div className="col-md-4" onChange={this.yearChangeHandler}>
                                        <select className="form-control">
                                            {YearsOption}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="userPassword">Password</label>
                                    <input type="password" id="userPassword" onChange={this.passwordChangeHandler} className="form-control" value={this.state.password} required></input>
                                </div>
                                <div className="text-center">
                                    <p className="text-danger">{this.state.errMsg}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-success">{this.state.successMsg}</p>
                                </div>
                                <div className="form-group">
                                    <input type="submit" id="userCreateAccount" onClick={this.submitCreateAccount} className="form-control bg-primary text-white" value="Create Account"></input>
                                </div>
                                <div className="panel text-center">
                                    <p>or</p>
                                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
//export CreateAccount Component
export default CreateAccount