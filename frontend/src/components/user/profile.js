import React, { Component } from 'react'
import '../../App.css'
import axios from 'axios'
import Navbar from '../navbar/navbar'
import Tweet from '../tweet/tweetComponent'
import constants from '../../utils/constants'

class UserProfile extends Component {

    constructor() {
        super()
        this.state = {
            userFeed: []
        }
    }

    componentDidMount() {
        let userId = localStorage.getItem('userId'),
            userName = localStorage.getItem('userName')
        axios.get(constants.BACKEND_SERVER.URL + "/tweets/fetchTweetByUserID/" + userId + "/" + userName + "/MYTWEETS", constants.TOKEN)
            .then((response) => {
                this.setState({
                    userFeed: response.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {

        var allTweets = [],
            data
        for (data in this.state.userFeed) {
            allTweets.push(<Tweet tweetData={this.state.userFeed[data]} />)
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
                <Navbar isActive="Profile" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')} />

                {/* Do not modify this div properties */}
                <div className="col-md-9 shadow p-5" >
                    {/* Insert UI here */}
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <img src="https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png" className="img-fluid" />
                        </div>
                        <div className="col-md-9">
                            <div className="row">
                                <div className="col-md-9">
                                    <h3 className="font-weight-bolder">Name of the user</h3>
                                    <h4 className="font-weight-lighter text-secondary">@Username</h4>
                                </div>
                                <div className="col-md-3">
                                    <a href="/user/settings"><button className="btn btn-outline-primary font-weight-bolder">Edit Profile</button></a>
                                </div>
                            </div>
                            <div className="mt-2 mb-2">Description goes here. Twitter project. CMPE 273 - Enterprise Distributed Systems.</div>
                            <div className="mt-2 row">
                                <div className="col-md-6">
                                    <h6 className="text-secondary"><i class="fas fa-map-marker-alt"></i> San Jose, CA - California</h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="text-secondary"><i class="fas fa-birthday-cake"></i> 1 January 1990</h6>
                                </div>
                            </div>
                            <div className="mt-2 row">
                                <div className="col-md-6">
                                    <h6><span className="font-weight-bolder text-dark">100</span> <span className="text-secondary">Following</span></h6>
                                </div>
                                <div className="col-md-6">
                                    <h6><span className="font-weight-bolder text-dark">200</span> <span className="text-secondary">Followers</span></h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    {allTweets}
                </div>

            </div>
        )
    }
}
//export UserProfile Component
export default UserProfile