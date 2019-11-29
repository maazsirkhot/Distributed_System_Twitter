import React, { Component } from 'react'
import '../../App.css'
import axios from 'axios'
import Navbar from '../navbar/navbar'
import constants from '../../utils/constants'

class List extends Component {

    constructor() {
        super()
        this.state = {
            errMsg: "",
            successMsg: ""
        }
    }

    subscribeToList = (e) => {
        e.preventDefault()
        const subscribeData = {
            subscriberId: localStorage.getItem('userId'),
            subscriberName: localStorage.getItem('userName'),
            listId: this.props.value._id,
            listName: this.props.value.listName
        }
        axios.post(constants.BACKEND_SERVER.URL + "/lists/subscribe", subscribeData, constants.TOKEN)
            .then((response) => {
                this.setState({
                    errMsg: "",
                    successMsg: "Subscribed to list"
                })
            })
            .catch((err) => {
                this.setState({
                    errMsg: "Error in subscribing",
                    successMsg: ""
                })
            })
    }

    render() {
        let subcribeButton = []
        if(this.props.type === "all") {
            subcribeButton = [<button className="btn btn-outline-primary" onClick={this.subscribeToList}>Subscribe</button>]
        }
        return (
            <a href={"/user/lists/" + this.props.value._id + "/tweets"} style={{ textDecoration: "none" }} className="text-dark">
                <div className="listContainer border-bottom pt-3 pb-1">

                    {/* Owner name and image */}
                    <div className="row">
                        <div className="col-md-1">
                            <img src={this.props.value.ownerImage} className="img-fluid" />
                        </div>
                        <div className="col-md-9">
                            <span className="font-weight-bolder">
                                <a href={"/view/profile/" + this.props.value.ownerId} className="text-dark">{this.props.value.ownerName}</a> 
                            </span>
                            <span> </span>
                            <span className="font-weight-lighter text-secondary"> 
                                <a href={"/view/profile/" + this.props.value.ownerId} className="text-secondary">@{this.props.value.ownerUserName}</a>
                            </span>
                            <span className="text-danger"> {this.state.errMsg}</span>
                            <span className="text-success"> {this.state.successMsg}</span>
                        </div>
                        <div className="col-md-2">
                            {subcribeButton}
                        </div>
                    </div>

                    {/* Name and description of the list */}
                    <h5 className="font-weight-light mt-2">{this.props.value.listName}</h5>
                    <h6 className="font-weight-light mt-2 text-secondary">{this.props.value.listDescription}</h6>
                    <h6 className="font-weight-light text-secondary">{this.props.value.noOfMembers} Member(s) · {this.props.value.noOfSubscribers} Subscriber(s)</h6>

                </div>
            </a>
        )
    }
}
//export List Component
export default List