import React, { Component } from 'react'
import axios from 'axios'
import Navbar from '../../navbar/navbar'
import Members from '../members'
import constants from '../../../utils/constants'

class UserListMembers extends Component {

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
                    <div className="border-bottom">
                        <h4 className="font-weight-bolder">Lists</h4>
                        <h6 className="font-weight-lighter text-secondary">@{localStorage.getItem('userName')}</h6>
                    </div>
                    <div className="row border-bottom">
                        <div className="col-md-4 p-3 text-center font-weight-bolder border-bottom border-primary text-primary">Tweets</div>
                        <div className="col-md-4 p-3 text-center font-weight-bolder"><a href="/user/lists/members" className="text-dark">Members</a></div>
                        <div className="col-md-4 p-3 text-center font-weight-bolder"><a href="/user/lists/subscribers" className="text-dark">Subscribers</a></div>
                    </div>


                </div>

            </div>
        )
    }
}
//export UserListMembers Component
export default UserListMembers