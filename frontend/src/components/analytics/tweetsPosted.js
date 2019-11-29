import React, { Component } from "react"
import "../../App.css"
import constants from "../../utils/constants"
import Navbar from "../navbar/navbar"
import TweetsMonthly from "./tweetsMonthly"
import axios from "axios"

class TweetsPosted extends Component {

	constructor() {
		super()
		this.state = {
			monthly: []
		}
		this.monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	}

	componentDidMount() {
		axios.get(constants.BACKEND_SERVER.URL + "/tweets/tweetsByMonth/" + localStorage.getItem("userId"), constants.TOKEN)
			.then((response) => {
				this.setState({
					monthly: response.data
				})
			})
	}

	render() {

		return (
			// Do not modify this div properties
			<div className="row" style={{ minHeight: 100 + "vh", maxWidth: 100 + "vw" }} >
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
				<Navbar isActive="Analytics" userName={localStorage.getItem("userName")} imageURL={localStorage.getItem("imageURL")} />

				{/* Do not modify this div properties */}
				<div className="col-md-9 shadow pl-5 pr-5 pb-5 pt-3">
					{/* Insert UI here */}
					<div className="border-bottom">
						<h4 className="font-weight-bolder">Analytics</h4>
						<h6 className="font-weight-lighter text-secondary">@{localStorage.getItem('userName')}</h6>
					</div>
					<div className="row border-bottom">
						<div className="col-md-3 p-3 text-center font-weight-bolder"><a href="/user/analytics" className="text-dark">Graphs</a></div>
						<div className="col-md-3 p-3 text-center font-weight-bolder border-bottom border-primary text-primary">Tweets posted</div>
						<div className="col-md-3 p-3 text-center font-weight-bolder"><a href="/view/liked" className="text-dark">My liked tweets</a></div>
						<div className="col-md-3 p-3 text-center font-weight-bolder"><a href="/view/myretweets" className="text-dark">My retweets</a></div>
					</div>

					<TweetsMonthly value={this.state.monthly}/>

				</div>
			</div>
		)
	}
}
// export TweetsPosted Component
export default TweetsPosted
