import React, { Component } from 'react'
import axios from 'axios'
import Navbar from '../../navbar/navbar'
import constants from '../../../utils/constants'
import Tweet from '../../tweet/tweetComponent'

class UserListTweets extends Component {

    constructor() {
        super()
        this.state = {
            listTweets: [],
            tweetIndex: 0,
            buttonState: false,
        }
        this.count = 2
    }

    componentDidMount() {
        const index = {
            start: 0,
            count: 5
        }
        axios.get(constants.BACKEND_SERVER.URL + "/tweets/fetchTweetForList/" + this.props.match.params.listId + "?start=" + this.state.tweetIndex + "&count=" + this.count, index)
            .then((response) => {
                this.setState({
                    listTweets: response.data,
                    tweetIndex: this.state.tweetIndex + this.count
                })
            })
    }

    fetchMoreTweets = (e) => {
        e.preventDefault()
        axios.get(constants.BACKEND_SERVER.URL + "/tweets/fetchTweetForList/" + this.props.match.params.listId + "?start=" + this.state.tweetIndex + "&count=" + this.count)
            .then((response) => {
                if(response.data.length > 0) {
                    this.setState({
                        listTweets: this.state.listTweets.concat(response.data),
                        tweetIndex: this.state.tweetIndex + this.count,
                    })
                } else {
                    this.setState({
                        buttonState: response.data.length < this.count? true: false,
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {

        var allTweets = [],
            data
        console.log(this.state.listTweets)
        for (data in this.state.listTweets) {
            allTweets.push(<Tweet tweetData={this.state.listTweets[data]} />)
        }
        let loadMoreButton = []
        if (this.state.listTweets.length > 0) {
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
                        <div className="col-md-4 p-3 text-center font-weight-bolder"><a href={"/user/lists/" + this.props.match.params.listId + "/members"} className="text-dark">Members</a></div>
                        <div className="col-md-4 p-3 text-center font-weight-bolder"><a href={"/user/lists/" + this.props.match.params.listId + "/subscribers"} className="text-dark">Subscribers</a></div>
                    </div>

                    {allTweets}
                    
                    {loadMoreButton}

                </div>

            </div>
        )
    }
}
//export UserListTweets Component
export default UserListTweets