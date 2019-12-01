import React, { Component } from 'react'
import axios from 'axios'
import Navbar from '../navbar/navbar'
import constants from '../../utils/constants'

class UserListAll extends Component {

    constructor() {
        super()
        this.state = {
            displayMembers: [],
            errMsg: "",
            successMsg: "",
            listName: "",
            listDescription: "",
            memberName: "",
        }
        this.allMembers = []
        this.memberDetails = []
    }

    IsValueEmpty = (Value) => {
        if ("".localeCompare(Value.replace(/\s/g, "")) === 0)
            return true
        return false
    }

    listNameChangeHandler = (e) => {
        this.setState({
            listName: e.target.value
        })
    }

    listDescriptionChangeHandler = (e) => {
        this.setState({
            listDescription: e.target.value
        })
    }

    memberNameChangeHandler = (e) => {
        this.setState({
            memberName: e.target.value
        })
    }

    createList = (e) => {
        e.preventDefault()
        if (this.IsValueEmpty(this.state.listName)){
            this.setState({
                errMsg: "List name cannot be empty",
                successMsg: ""
            })
            return
        }
        // console.log(this.memberDetails)
        const newListData = {
            ownerId: localStorage.getItem("userId"),
            ownerName: localStorage.getItem("name"),
            ownerUserName: localStorage.getItem("userName"),
            ownerImage: localStorage.getItem("imageURL"),
            listName: this.state.listName,
            listDescription: this.state.listDescription,
            membersId: this.memberDetails
        }
        // console.log(newListData)
        axios.post(constants.BACKEND_SERVER.URL + "/lists/", newListData)
            .then((response) => {
                console.log(response.status)
                this.setState({
                    errMsg: "",
                    successMsg: "List created successfully",
                    listName: "",
                    listDescription: "",
                    memberName: "",
                    displayMembers: []
                })
                this.allMembers = []
                this.memberDetails = []
            })
            .catch(err => {
                this.setState({
                    errMsg: "Duplicate list name",
                    successMsg: ""
                })
            })
    }

    addUser = (e) => {
        e.preventDefault()
        axios.get(constants.BACKEND_SERVER.URL + "/users/findUser/" + this.state.memberName)
            .then((response) => {
                if (response.status === 200) {
                    if (this.allMembers.includes(response.data._id)) {
                        this.setState({
                            errMsg: "Duplicate user",
                            successMsg: ""
                        })
                    } else if (response.data._id === localStorage.getItem('userId')) {
                        this.setState({
                            errMsg: "Cannot add yourself to a list",
                            successMsg: ""
                        })
                    } else {
                        this.setState({
                            displayMembers: this.state.displayMembers.concat(<span className="p-3 ml-2 mr-2 bg-primary text-white rounded">{response.data.userName}</span>),
                            memberName: "",
                            errMsg: "",
                            successMsg: "User added to the list",
                        })
                        this.allMembers.push(response.data._id)
                        this.memberDetails.push({
                            "memberId" : response.data._id,
                            "memberName" : response.data.userName,
                            "memberImageURL" : response.data.imageURL? response.data.imageURL : "https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png"
                        })
                    }
                } else {
                    this.setState({
                        errMsg: "No user found",
                        successMsg: ""
                    })
                }
            })
    }

    render() {

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
                <Navbar isActive="Lists" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')} />

                {/* Do not modify this div properties */}
                <div className="col-md-9 shadow pl-5 pr-5 pb-5 pt-3" >
                    {/* Insert UI here */}
                    <div className="row border-bottom">
                        <div className="col-md-11">
                            <h4 className="font-weight-bolder">Lists</h4>
                            <h6 className="font-weight-lighter text-secondary">@{localStorage.getItem('userName')}</h6>
                        </div>
                        <div className="col-md-1">
                            <button className="btn btn-outline-primary" onClick={this.createList}>Create</button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Name of the new list" value={this.state.listName} onChange={this.listNameChangeHandler} />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Description of the list" value={this.state.listDescription} onChange={this.listDescriptionChangeHandler} />
                        </div>
                        <div className="form-group">
                            <form onSubmit={this.addUser}>
                                <input type="text" className="form-control" placeholder="Add members" value={this.state.memberName} onChange={this.memberNameChangeHandler} />
                            </form>
                        </div>
                        <div className="text-center">
                            <p className="text-danger">{this.state.errMsg}</p>
                            <p className="text-success">{this.state.successMsg}</p>
                        </div>
                    </div>

                    <div className="mt-5">
                        {this.state.displayMembers}
                    </div>

                </div>

            </div>
        )
    }
}
//export UserListAll Component
export default UserListAll