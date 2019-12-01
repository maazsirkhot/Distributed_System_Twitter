import React, { Component } from "react"
import "../../App.css"
import axios from "axios"
import Navbar from "../navbar/navbar"
import Tweet from "../tweet/tweetComponent"
import constants from "../../utils/constants"
import CanvasJSReact from "../../canvasjs/canvasjs.react"

var CanvasJS = CanvasJSReact.CanvasJS
var CanvasJSChart = CanvasJSReact.CanvasJSChart

class MonthlyTweets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hourlyData : {},
            prevDay : null,
            prevMonth : null,
        }
        this.monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        this.hours = { 
			0: "12 AM", 
			1: "1 AM", 
			2: "2 AM", 
			3: "3 AM", 
			4: "4 AM", 
			5: "5 AM", 
			6: "6 AM", 
			7: "7 AM", 
			8: "8 AM", 
			9: "9 AM", 
			10: "10 AM", 
			11: "11 AM", 
			12: "12 PM", 
			13: "1 PM", 
			14: "2 PM", 
			15: "3 PM", 
			16: "4 PM", 
			17: "5 PM", 
			18: "6 PM", 
			19: "7 PM", 
			20: "8 PM", 
			21: "9 PM", 
			22: "10 PM", 
			23: "11 PM" 
		}
    }

    componentDidMount() {
        if(this.props.day && this.props.month) {
            axios.get(constants.BACKEND_SERVER.URL + "/tweets/tweetsByHour/" + localStorage.getItem("userId") + "/" + this.props.day + "/" + this.props.month + "/2019")
                .then((response) => {
                    console.log("data", response.data)
                    this.setState({
                        hourlyData: response.data,
                        prevDay: parseInt(this.props.day),
                        prevMonth: parseInt(this.props.month),
                    })
                })
        }
    }

    componentDidUpdate() {
        if(this.props.day != this.state.prevDay || this.props.month != this.state.prevMonth) {
            console.log("UPDATING COMPONENT")
            axios.get(constants.BACKEND_SERVER.URL + "/tweets/tweetsByHour/" + localStorage.getItem("userId") + "/" + this.props.day + "/" + this.props.month + "/2019")
                .then((response) => {
                    this.setState({
                        hourlyData: response.data,
                        prevDay: parseInt(this.props.day),
                        prevMonth: parseInt(this.props.month),
                    })
                })
        }
    }

    render() {
        
        let viewsgraph = []
        let d,
            label,
            y
        for (d in this.state.hourlyData) {
            label = this.hours[d]
            y = this.state.hourlyData[d]
            const data = {
                label,
                y,
            }
            viewsgraph.push(data)
        }
        let topViewedTweets = viewsgraph
        const options = {
            animationEnabled: true,
            exportEnabled: true,
            theme: "light2",
            title: {
                text: "Tweets posted on " + this.props.day + " " + this.props.monthValue,
            },
            axisY: {
                title: "Tweet count",
            },
            axisX: {
                title: "Day of month",
            },
            data: [
                {
                    type: "line",
                    dataPoints: topViewedTweets,
                },
            ],
        }
        return (
            <div className="pt-5 pb-5">
                <CanvasJSChart options={options} /* onRef={ref => (this.chart = ref)} */ />
            </div>
        )
    }
}
// export MonthlyTweets Component
export default MonthlyTweets
