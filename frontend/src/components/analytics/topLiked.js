import React, { Component } from "react"
import "../../App.css"
import axios from "axios"
import Navbar from "../navbar/navbar"
import Tweet from "../tweet/tweetComponent"
import constants from "../../utils/constants"
import CanvasJSReact from "../../canvasjs/canvasjs.react"

var CanvasJS = CanvasJSReact.CanvasJS
var CanvasJSChart = CanvasJSReact.CanvasJSChart

class UserAnalytics extends Component {
    constructor(props) {
        super(props)
        this.state = {
            topRetweetedTweets: [],
            topLikedTweets: [],
            topViewedTweets: [],
        }
    }
    componentDidMount() {
        // get top liked tweets for rendering Chart
        axios
            .get(
                constants.BACKEND_SERVER.URL +
                "/tweets/topTweetsByLike/" +
                localStorage.getItem("userId")
            )
            .then(response => {
                //console.log(response.data)
                const likegraph = []
                let result = response.data
                for (let d in result) {
                    let label = result[d]._id
                    let y = result[d].likeCount
                    const data = {
                        label,
                        y,
                    }
                    likegraph.push(data)
                }

                this.setState({
                    topLikedTweets: likegraph,
                })
                // console.log(this.state.topLikedTweets)
            })
            .catch(err => {
                console.log(err)
            })
        //get top retweeted tweets for rendering Chart
        axios
            .get(
                constants.BACKEND_SERVER.URL +
                "/tweets/topTweetsByRetweets/" +
                localStorage.getItem("userId")
            )
            .then(response => {
                //console.log(response.data)
                const retweetgraph = []
                let result = response.data
                for (let d in result) {
                    let label = result[d]._id
                    let y = result[d].retweetCount
                    const data = {
                        label,
                        y,
                    }

                    retweetgraph.push(data)
                }

                this.setState({
                    topRetweetedTweets: retweetgraph,
                })
                // console.log(this.state.topRetweetedTweets)
            })
            .catch(err => {
                console.log(err)
            })
        // graph for users tweet views count
        axios.get(constants.BACKEND_SERVER.URL + "/tweets/topTweetsByViews/" + localStorage.getItem("userId"))
            .then(response => {
                // console.log(response.data)
                const viewsgraph = []
                let result,
                    d,
                    label,
                    y
                result = response.data
                for (d in result) {
                    label = result[d]._id.tweetId
                    y = result[d].total
                    if (y > 0) {
                        const data = {
                            label,
                            y,
                        }
                        viewsgraph.push(data)
                    }
                }

                this.setState({
                    topViewedTweets: viewsgraph,
                })
                // console.log(this.state.topViewedTweets)
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        let topViewedTweets = this.state.topViewedTweets
        const options = {
            animationEnabled: true,
            exportEnabled: true,
            theme: "light2",
            title: {
                text: "Top 10 Viewed  Tweets",
            },
            axisY: {
                title: "View count",
            },
            axisX: {
                title: "Tweet IDs",
            },
            data: [
                {
                    type: "column",
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
// export UserAnalytics Component
export default UserAnalytics
