import React, { Component } from 'react'
import '../../App.css'
import axios from 'axios'
import Navbar from '../navbar/navbar'
import constants from '../../utils/constants'

class UserHome extends Component {

    constructor(props) {
        super(props)
        this.state = {
            newTweet: ""
        }
    }

    IsValueEmpty = (Value) => {
        if ("".localeCompare(Value.replace(/\s/g, "")) == 0)
            return true
        return false
    }

    tweetChangeHandler = (e) => {
        if (e.target.value.length <= 280) {
            this.setState({
                newTweet: e.target.value
            })
        }
    }

    postTweet = (e) => {
        e.preventDefault()
        const data = {
            userId: constants.USER_ID,
            userName: constants.USERNAME,
            userImageURL: constants.IMAGE_URL,
            originalBody: this.state.newTweet
        }
        if (!this.IsValueEmpty(data.originalBody)) {

            axios.post(constants.BACKEND_SERVER.URL + "/tweets/createTweet", data, constants.TOKEN)
            .then((response) => {
                this.setState({
                    newTweet : ""
                })
            })
        }
    }

    render() {
        console.log(constants.IMAGE_URL)

        return (

            // Do not modify this div properties
            <div className="row" style={{ minHeight: 100 + "vh", maxWidth: 100 + "vw" }}>
                {/* 
                    Do not remove navbar. isActive will indicate which is the active page.
                    It can be one of the following values.
                    1. Home
                    2. Explore
                    3. Messages
                    4. Bookmarks
                    5. Lists
                    6. Profile
                    7. Analytics
                */}
                <Navbar isActive="Home" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')}/>

                {/* Do not modify this div properties */}
                <div className="col-md-8 shadow p-5">
                    {/* Insert UI here */}

                    <div>
                        <div className="row">
                            <div className="col-md-1">
                                <img src={constants.IMAGE_URL} className="img-fluid" />
                            </div>
                            <div className="col-md-11">
                                <textarea className="shadow p-3 mb-2" rows="5" style={{ resize: "none", width: 100 + "%", border: "none" }} placeholder="What's happening?" value={this.state.newTweet} onChange={this.tweetChangeHandler} />
                            </div>

                        </div>

                        <div className="text-right">{this.state.newTweet.length}/280 | <button className="btn btn-primary" onClick={this.postTweet}>Tweet</button></div>
                    </div>

                </div>

            </div>
        )
    }
}
//export UserHome Component
export default UserHome