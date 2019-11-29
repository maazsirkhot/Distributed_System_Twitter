import React, { Component } from "react"
import "../../App.css"
import Navbar from "../navbar/navbar"
import TopViewed from "./topViewed"
import TopLiked from "./topLiked"
import TopRetweet from "./topRetweet"

class UserAnalytics extends Component {

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
						<div className="col-md-4 p-3 text-center font-weight-bolder border-bottom border-primary text-primary">Graphs</div>
						<div className="col-md-4 p-3 text-center font-weight-bolder"><a href="/view/liked" className="text-dark">My liked tweets</a></div>
						<div className="col-md-4 p-3 text-center font-weight-bolder"><a href="/view/myretweets" className="text-dark">My retweets</a></div>
					</div>

					<TopViewed />
					<TopLiked />
					<TopRetweet />

				</div>
			</div>
		)
	}
}
// export UserAnalytics Component
export default UserAnalytics
