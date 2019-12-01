import React, { Component } from 'react'
import { Redirect } from 'react-router'
import axios from 'axios'
import constants from '../../utils/constants'

class DeleteTweet extends Component {

    componentDidMount() {
        axios.delete(constants.BACKEND_SERVER.URL + "/tweets/" + this.props.match.params.tweetId)
    }

    render() {
        
        return (
            <Redirect to="/user/profile" />
        )

    }
}
//export DeleteTweet Component
export default DeleteTweet