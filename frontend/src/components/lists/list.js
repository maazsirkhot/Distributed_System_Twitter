import React, { Component } from 'react'
import '../../App.css'
import axios from 'axios'
import Navbar from '../navbar/navbar'
import constants from '../../utils/constants'

class List extends Component {

    render() {
        return (
            <a href="/user/lists/tweets" style={{ textDecoration: "none" }} className="text-dark">
                <div className="listContainer border-bottom pt-3 pb-1">

                    {/* Owner name and image */}
                    <div className="row">
                        <div className="col-md-1">
                            <img src={this.props.value.ownerImage} className="img-fluid" />
                        </div>
                        <div className="col-md-11">
                            <span className="font-weight-bolder">{this.props.value.ownerName} </span>
                            <span className="font-weight-lighter text-secondary"> @{this.props.value.ownerUserName}</span>
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