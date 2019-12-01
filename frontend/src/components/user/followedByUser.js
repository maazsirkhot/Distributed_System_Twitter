import React, { Component } from 'react'
import '../../App.css'
import axios from 'axios'
import Navbar from '../navbar/navbar'
import constants from '../../utils/constants'
import Member from '../lists/members'

class FollowedByUser extends Component {

    constructor() {
        super()
        this.state = {
            allUsers: [],
        }
    }

    componentDidMount() {
        let userId = this.props.match.params.userId
        axios.get(constants.BACKEND_SERVER.URL + "/users/followedByUserId/" + userId)
            .then((response) => {
                this.setState({
                    allUsers: response.data.allUsers,
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {

        var membersComponent = [],
            data
        for (data in this.state.allUsers) {
            membersComponent.push(<Member value={this.state.allUsers[data]} />)
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
                <Navbar isActive="" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')} />

                {/* Do not modify this div properties */}
                <div className="col-md-9 shadow pl-5 pr-5 pb-5 pt-3">
                    {/* Insert UI here */}
                    <div className="border-bottom">
                        <h4 className="font-weight-bolder">Users followed</h4>
                        <h6 className="font-weight-lighter text-secondary"> </h6>
                    </div>

                    {membersComponent}

                </div>

            </div>
        )
    }
}
//export FollowedByUser Component
export default FollowedByUser