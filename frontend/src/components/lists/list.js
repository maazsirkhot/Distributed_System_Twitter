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
                            <img src="https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png" className="img-fluid" />
                        </div>
                        <div className="col-md-11"><span className="font-weight-bolder">Owner Name </span><span className="font-weight-lighter text-secondary"> @Username</span></div>
                    </div>

                    {/* Name and description of the list */}
                    <h5 className="font-weight-light mt-2">Name of the list</h5>
                    <h6 className="font-weight-light mt-2 text-secondary">Description of the list</h6>
                    <h6 className="font-weight-light text-secondary">3 Members · 1 Subscriber</h6>

                </div>
            </a>
        )
    }
}
//export List Component
export default List