import React, { Component } from 'react'
import '../../App.css'
import axios from 'axios'
import Navbar from '../navbar/navbar'
import constants from '../../utils/constants'

class Settings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: "",
            userName: "",
            city: "",
            state: "",
            zipcode: "",
            imageURL: "",
            description: "",
            phone: "",
            email: "",
            dateOfBirth: "",
            newPassword: "",
            confirmPassword: "",
            storedUserName: localStorage.getItem('userName')
        }
        this.onChange = this.onChange.bind(this);
        
    }

    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.files[0]
        })
    }

    componentDidMount() {
        axios.get(constants.BACKEND_SERVER.URL + "/users/profile/" + localStorage.getItem('userId'))
            .then((response, reject) => {
                console.log(response.data)
                this.setState({
                    name: response.data.name,
                    userName: response.data.userName,
                    city: response.data.city,
                    state: response.data.state,
                    zipcode: response.data.zipcode,
                    description: response.data.description,
                    phone: response.data.phone,
                    email: response.data.email,
                    dateOfBirth: response.data.dateOfBirth
                })
            })
    }

    IsValueEmpty = (Value) => {
        if (Value === null || Value === undefined) {
            return true
        }
        if ("".localeCompare(Value.replace(/\s/g, "")) == 0)
            return true
        return false
    }

    IsValidPassword = (Password) => {
        if (Password === undefined || Password === null || Password === "") {
            return true
        }
        if (Password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            return true
        }
        return false
    }

    IsValidZipcode = (Zipcode) => {
        if (Zipcode === undefined || Zipcode === null || Zipcode === "") {
            return true
        }
        if (Zipcode.match(/^(?!0{5})(\d{5})(?!-?0{4})(|-\d{4})?$/)) {
            return true
        }
        return false
    }

    nameChangeHandler = (e) => {
        this.setState({
            name: e.target.value
        })
    }

    descriptionChangeHandler = (e) => {
        if (e.target.value.length <= 160) {
            this.setState({
                description: e.target.value
            })
        }
    }

    emailChangeHandler = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    userNameChangeHandler = (e) => {
        if (e.target.value.length <= 15) {
            this.setState({
                userName: e.target.value
            })
        }
    }

    phoneChangeHandler = (e) => {
        if (e.target.value.length <= 10) {
            this.setState({
                phone: e.target.value
            })
        }
    }

    cityChangeHandler = (e) => {
        this.setState({
            city: e.target.value
        })
    }

    stateChangeHandler = (e) => {
        this.setState({
            state: e.target.value
        })
    }

    zipcodeChangeHandler = (e) => {
        this.setState({
            zipcode: e.target.value
        })
    }

    newPasswordChangeHandler = (e) => {
        this.setState({
            newPassword: e.target.value
        })
    }

    confirmPasswordChangeHandler = (e) => {
        this.setState({
            confirmPassword: e.target.value
        })
    }

    doPasswordsMatch = () => {
        if (this.state.newPassword.localeCompare(this.state.confirmPassword) == 0) {
            return true
        }
        return false
    }

    processData = (data) => {
        if (data == null || data.length == 0) {
            return ""
        }
        return data
    }

    updateProfile = (e) => {
        e.preventDefault()
        let data = {
            userId: localStorage.getItem('userId'),
            name: this.state.name,
            userName: this.state.userName,
            city: this.processData(this.state.city),
            state: this.processData(this.state.state),
            zipcode: this.processData(this.state.zipcode),
            imageURL: this.processData(this.state.imageURL),
            description: this.processData(this.state.description),
            email: this.processData(this.state.email),
            image : this.state.profileImage
        }
        if (this.processData(this.state.phone).length > 0) {
            data.phone = Number(this.processData(this.state.phone))
        }
        if (!this.doPasswordsMatch()) {
            this.setState({
                errMsg: "Passwords do not match",
                successMsg: ""
            })
        } else if (!this.IsValidPassword(this.state.newPassword)) {
            this.setState({
                errMsg: "Invalid password format",
                successMsg: ""
            })
        } else if (!this.IsValidZipcode(data.zipcode)) {
            this.setState({
                errMsg: "Invalid zipcode",
                successMsg: ""
            })
        } else if (this.IsValueEmpty(data.name) || this.IsValueEmpty(data.userName)) {
            this.setState({
                errMsg: "Name and username cannot be empty",
                successMsg: ""
            })
        } else if (!(this.IsValueEmpty(data.email) || this.IsValueEmpty(data.phone)) || (this.IsValueEmpty(data.email) && this.IsValueEmpty(data.phone))) {
            this.setState({
                errMsg: "Please provide email or phone number",
                successMsg: ""
            })
        } else {
            if (this.state.newPassword.length > 0) {
                data.password = this.state.newPassword
            }
            console.log(data)

            // let profileData = new FormData();
            // profileData.append("userId", data.userId);
            // profileData.append("name", data.name);
            // profileData.append("city", data.city);
            // profileData.append("username", data.username);
            // profileData.append("description", data.description);
            // profileData.append("email", data.email);
            // profileData.append("state", data.state);
            // profileData.append("zipcode", data.zipcode);
            // profileData.append("phone", data.phone);
            // profileData.append("imageURL", data.imageURL);
            // profileData.append("password", data.password);
            // profileData.append("image", this.state.profileImage);
            // console.log(profileData);

            axios.put(constants.BACKEND_SERVER.URL + "/users/profile/", data)
                .then((response) => {
                    if (response.status === 200) {
                        localStorage.setItem('userName', this.state.userName)
                        this.setState({
                            errMsg: "",
                            successMsg: "Updated successully",
                            storedUserName: this.state.userName,
                        })
                    }
                })
                .catch(err => {
                    this.setState({
                        errMsg: "Error in updating",
                        successMsg: ""
                    })
                })
        }
    }

    render() {

        let stateCodes = [],
            code,
            stateValue
        for (code in constants.STATE_CODES) {
            stateValue = code + " - " + constants.STATE_CODES[code]
            stateCodes.push(<option className="form-control" value={stateValue}>{stateValue}</option>)
        }

        return (

            // Do not modify this div properties
            <div className="row" style={{ minHeight: 100 + "vh", maxWidth: 100 + "vw" }}>
                {/* 
                    Do not remove navbar. isActive will indicate which is the active page.
                    It can be one of the following values.
                    1. Home
                    2. Messages
                    3. Bookmarks
                    4. Lists
                    5. Profile
                    6. Settings
                    7. Analytics
                */}
                <Navbar isActive="Settings" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')} />

                {/* Do not modify this div properties */}
                <div className="col-md-9 shadow p-5">
                    {/* Insert UI here */}
                    <h3 className="text-center text-weight-bolder">Update profile</h3>
                    <form onSubmit={this.updateProfile}>
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" required onChange={this.nameChangeHandler} value={this.state.name} />
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea rows="4" style={{ resize: "none" }} class="form-control" onChange={this.descriptionChangeHandler} value={this.state.description} />
                        </div>

                        <div class="form-group">
                            <label>Email address</label>
                            <input type="email" class="form-control" onChange={this.emailChangeHandler} value={this.state.email} />
                        </div>

                        <div className="row">
                            <div class="form-group col-md-6">
                                <label>Username</label>
                                <input type="text" class="form-control" required onChange={this.userNameChangeHandler} value={this.state.userName} />
                            </div>
                            <div class="form-group col-md-6">
                                <label>Phone Number</label>
                                <input type="text" class="form-control" onChange={this.phoneChangeHandler} value={this.state.phone} />
                            </div>
                        </div>

                        <div className="row">
                            <div class="form-group col-md-4">
                                <label>City</label>
                                <input type="text" class="form-control" onChange={this.cityChangeHandler} value={this.state.city} />
                            </div>
                            <div class="form-group col-md-4">
                                <label>State</label>
                                <select class="custom-select" onChange={this.stateChangeHandler} value={this.state.state}>
                                    {stateCodes}
                                </select>
                            </div>
                            <div class="form-group col-md-4">
                                <label>Zipcode</label>
                                <input type="text" class="form-control" onChange={this.zipcodeChangeHandler} value={this.state.zipcode} />
                            </div>
                        </div>

                        <div className="row">
                            <div class="form-group col-md-6">
                                <label>New password</label>
                                <input type="password" class="form-control" onChange={this.newPasswordChangeHandler} value={this.state.newPassword} />
                            </div>
                            <div class="form-group col-md-6">
                                <label>Confirm password</label>
                                <input type="password" class="form-control" onChange={this.confirmPasswordChangeHandler} value={this.state.confirmPassword} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="text-center">
                                <div className="file-field">
                                <div className="btn btn-primary btn-sm float-center">
                                    <input type="file" accept="image/*" name="profileImage" onChange = {this.onChange}></input>
                                </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-danger">{this.state.errMsg}</p>
                            <p className="text-success">{this.state.successMsg}</p>
                        </div>

                        <div class="form-group">
                            <input type="submit" class="form-control bg-primary text-white" value="Update" />
                        </div>

                    </form>
                </div>

            </div>
        )
    }
}
//export Settings Component
export default Settings