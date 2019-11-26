import React, { Component } from 'react'
import axios from 'axios'
import Navbar from '../../navbar/navbar'
import List from '../list'
import constants from '../../../utils/constants'

class UserListOwned extends Component {

    constructor() {
        super()
        this.state = {
            ownedLists: []
        }
    }

    componentDidMount() {
        axios.get(constants.BACKEND_SERVER.URL + "/lists/owned/" + localStorage.getItem("userId"), constants.TOKEN)
        .then((response) => {
            this.setState({
                ownedLists: response.data
            })
        })
    }

    render() {

        let list,
            listComponent = []

        for(list in this.state.ownedLists) {
            listComponent.push(<List value={this.state.ownedLists[list]}/>)
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
                    <div className="row border-bottom">
                        <div className="col-md-11">
                            <h4 className="font-weight-bolder">Lists</h4>
                            <h6 className="font-weight-lighter text-secondary">@{localStorage.getItem('userName')}</h6>
                        </div>
                        <div className="col-md-1">
                            <a href="/user/lists/new" className="text-dark"><h3 class="fas fa-plus-circle"></h3></a>
                        </div>
                    </div>
                    <div className="row border-bottom">
                        <div className="col-md-4 p-3 text-center font-weight-bolder border-bottom border-primary text-primary">Owned</div>
                        <div className="col-md-4 p-3 text-center font-weight-bolder"><a href="/user/lists/subscribed" className="text-dark">Subscribed</a></div>
                        <div className="col-md-4 p-3 text-center font-weight-bolder"><a href="/user/lists/all" className="text-dark">All Lists</a></div>
                    </div>
                    
                    {listComponent}

                </div>

            </div>
        )
    }
}
//export UserListOwned Component
export default UserListOwned