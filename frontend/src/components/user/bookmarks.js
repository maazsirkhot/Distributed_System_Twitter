import React, { Component } from 'react'
import '../../App.css'
import axios from 'axios'
import Navbar from '../navbar/navbar'
import Tweet from '../tweet/tweetComponent'
import constants from '../../utils/constants'

class UserBookmarks extends Component {

    constructor() {
        super()
        this.state = {
            userFeed: []
        }
    }

    componentDidMount() {
        let userId = localStorage.getItem('userId'),
            userName = localStorage.getItem('userName')
        axios.get(constants.BACKEND_SERVER.URL + "/tweets/fetchTweetByUserID/" + userId + "/" + userName + "/BOOKMARKEDTWEETS", constants.TOKEN)
            .then((response) => {
                console.log(response)
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
                <Navbar isActive="Bookmarks" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')} />

                {/* Do not modify this div properties */}
                <div className="col-md-9 shadow pl-5 pr-5 pb-5 pt-3">
                    {/* Insert UI here */}
                    <div className="border-bottom">
                        <h4 className="font-weight-bolder">Bookmarks</h4>
                        <h6 className="font-weight-lighter text-secondary">@{localStorage.getItem('userName')}</h6>
                    </div>
                    {allTweets}
                </div>

            </div>
        )
    }
}
//export UserBookmarks Component
export default UserBookmarks