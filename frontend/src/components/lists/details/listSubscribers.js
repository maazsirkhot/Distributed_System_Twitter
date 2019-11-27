import React, { Component } from 'react'
import axios from 'axios'
import Navbar from '../../navbar/navbar'
import Members from '../members'
import constants from '../../../utils/constants'

class UserListSubscribers extends Component {

    constructor() {
        super()
        this.state = {
            listSubscribers: []
        }
    }

    componentDidMount() {
        axios.get(constants.BACKEND_SERVER.URL + "/lists/subscribers/" + this.props.match.params.listId, constants.TOKEN)
            .then((response) => {
                this.setState({
                    listSubscribers: response.data
                })
            })
    }

    render() {

        var index,
            allMembersComponent = []
        for (index in this.state.listSubscribers) {
            allMembersComponent.push(<Members value={this.state.listSubscribers[index]} />)
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
                <Navbar isActive="Lists" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')} />

                {/* Do not modify this div properties */}
                <div className="col-md-9 shadow pl-5 pr-5 pb-5 pt-3" >
                    {/* Insert UI here */}
                    <div className="border-bottom">
                        <h4 className="font-weight-bolder">Lists</h4>
                        <h6 className="font-weight-lighter text-secondary">@{localStorage.getItem('userName')}</h6>
                    </div>
                    <div className="row border-bottom">
                        <div className="col-md-4 p-3 text-center font-weight-bolder"><a href={"/user/lists/" + this.props.match.params.listId + "/tweets"} className="text-dark">Tweets</a></div>
                        <div className="col-md-4 p-3 text-center font-weight-bolder"><a href={"/user/lists/" + this.props.match.params.listId + "/members"} className="text-dark">Members</a></div>
                        <div className="col-md-4 p-3 text-center font-weight-bolder border-bottom border-primary text-primary">Subscribers</div>
                    </div>

                    {allMembersComponent}

                </div>

            </div>
        )
    }
}
//export UserListSubscribers Component
export default UserListSubscribers