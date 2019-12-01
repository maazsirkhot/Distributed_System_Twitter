import React, { Component } from "react"
import axios from "axios"
import "../../App.css"
import constants from "../../utils/constants"
import Navbar from "../navbar/navbar"
import TweetsMonthly from "./tweetsMonthly"
import TweetsDaily from "./tweetsDaily"
import TweetsHourly from "./tweetsHourly"

class TweetsPosted extends Component {

	constructor() {
		super()
		this.state = {
			monthly: [],
			defaultmonthNumber: null,
			monthYear: null,
			date: null,
		}
		this.monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	}

	componentDidMount() {
		axios.get(constants.BACKEND_SERVER.URL + "/tweets/tweetsByMonth/" + localStorage.getItem("userId"))
			.then((response) => {
				console.log(response.data)
				this.setState({
					monthly: response.data,
				})
				if (response.data.length > 0) {
					this.setState({
						defaultmonthNumber: response.data[0]._id,
						monthYear: this.monthNames[response.data[0]._id] + " 2019",
						date: 1
					})
				}
			})
	}

	monthChangeHandler = (e) => {
		this.setState({
			defaultmonthNumber: e.target.value,
			monthYear: this.monthNames[e.target.value] + " 2019",
			date: 1
		})
	}

	dayChangeHandler = (e) => {
		this.setState({
			date: e.target.value
		})
	}

	render() {

		let monthsPresent = [],
			index,
			month,
			monthNumber,
			allHours = []
		for (index in this.state.monthly) {
			monthNumber = this.state.monthly[index]._id
			month = this.monthNames[monthNumber]
			monthsPresent.push(<option value={monthNumber}>{month} 2019</option>)
		}

		for (index = 1; index <= 31; index++) {
			allHours.push(<option value={index}>{index}</option>)
		}


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

					<div className="border-bottom">
						<TweetsMonthly value={this.state.monthly} />
					</div>

					<div className="row">
						<div className="col-md-6">
							<div className="border-bottom bg-secondary p-3">
								<select className="form-control" onChange={this.monthChangeHandler}>
									{monthsPresent}
								</select>
							</div>

							<TweetsDaily value={this.state.defaultmonthNumber} month={this.state.monthYear} />
						</div>
						<div className="col-md-6">
							<div className="border-bottom bg-secondary p-3">
								<select className="form-control" onChange={this.dayChangeHandler}>
									{allHours}
								</select>
							</div>

							<TweetsHourly day={this.state.date} month={this.state.defaultmonthNumber} monthValue={this.state.monthYear} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
// export TweetsPosted Component
export default TweetsPosted
