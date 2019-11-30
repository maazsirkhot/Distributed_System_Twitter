import React, { Component } from 'react'
import '../../App.css'
import axios from 'axios'
import Navbar from '../navbar/navbar'
import Tweet from '../tweet/tweetComponent'
import constants from '../../utils/constants'

class UserHome extends Component {

    constructor(props) {
        super(props)
        this.state = {
            newTweet: "",
            userFeed: [],
            tweetIndex: 0,
            buttonState: false,
        }
        this.count = 3;
        this.onChange = this.onChange.bind(this);
    }

    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.files[0]
        });
    }

    componentDidMount() {
        let userId = localStorage.getItem('userId'),
            userName = localStorage.getItem('userName')
        axios.get(constants.BACKEND_SERVER.URL + "/tweets/fetchTweetByUserID/" + userId + "/USERFEED?start=" + this.state.tweetIndex + "&count=" + this.count , constants.TOKEN)
            .then((response) => {
                console.log(response.data)
                this.setState({
                    userFeed: response.data,
                    tweetIndex: this.state.tweetIndex + this.count
                })
            })
            .catch(err => {
                console.log(err)
            })
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
            userId: localStorage.getItem('userId'),
            userName: localStorage.getItem('userName'),
            userImageURL: localStorage.getItem('imageURL'),
            originalBody: this.state.newTweet
        }
        if (!this.IsValueEmpty(data.originalBody)) {

            let tweetData = new FormData();
            tweetData.append("userId", data.userId);
            tweetData.append("userName", data.userName);
            tweetData.append("userImageURL", data.userImageURL);
            tweetData.append("originalBody", data.originalBody);
            tweetData.append("image", this.state.tweetImage);

            console.log(tweetData);   

            axios.post(constants.BACKEND_SERVER.URL + "/tweets/createTweet", tweetData, constants.TOKEN)
                .then((response) => {
                    this.setState({
                        newTweet: ""
                    })
                })
        }
    }

    fetchMoreTweets = (e) => {
        e.preventDefault()
        let userId = localStorage.getItem('userId')
        axios.get(constants.BACKEND_SERVER.URL + "/tweets/fetchTweetByUserID/" + userId + "/USERFEED?start=" + this.state.tweetIndex + "&count=" + this.count, constants.TOKEN)
            .then((response) => {
                this.setState({
                    userFeed: this.state.userFeed.concat(response.data),
                    tweetIndex: this.state.tweetIndex + this.count,
                    buttonState: response.data.length < this.count? true: false,
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
        let loadMoreButton = []
        if (this.state.userFeed.length > 0) {
            loadMoreButton.push(
                <div className="row pt-4">
                    <div className="col-md-3 offset-md-9">
                        <button className="btn btn-outline-primary w-100" onClick={this.fetchMoreTweets} disabled={this.state.buttonState}>Load more tweets</button>
                    </div>
                </div>
            )
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
                <Navbar isActive="Home" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')} />

                {/* Do not modify this div properties */}
                <div className="col-md-9 shadow p-5" >
                    {/* Insert UI here */}

                    <div>
                        <div className="row">
                            <div className="col-md-1">
                                <img src={localStorage.getItem('imageURL')} className="img-fluid" />
                            </div>
                            <div className="col-md-11">
                                <textarea className="shadow p-3 mb-2" rows="5" style={{ resize: "none", width: 100 + "%", border: "none" }} placeholder="What's happening?" value={this.state.newTweet} onChange={this.tweetChangeHandler} />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="file-field">
                            <div className="btn btn-primary btn-sm float-center">
                                <input type="file" accept="image/*" name="tweetImage" onChange = {this.onChange}></input>
                            </div>
                            </div>
                        </div>
                        <div className="text-right">{this.state.newTweet.length}/280 | <button className="btn btn-primary" onClick={this.postTweet}>Tweet</button></div>
                        <div style={{ height: 5 + "px" }} className="bg-secondary mt-2"></div>
                    </div>

                    {allTweets}

                    {loadMoreButton}

                </div>

            </div>
        )
    }
}
//export UserHome Component
export default UserHome