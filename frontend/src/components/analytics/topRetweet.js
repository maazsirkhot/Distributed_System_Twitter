import React, { Component } from "react"
import "../../App.css"
import axios from "axios"
import constants from "../../utils/constants"
import CanvasJSReact from "../../canvasjs/canvasjs.react"

var CanvasJSChart = CanvasJSReact.CanvasJSChart

class TopRetweeted extends Component {
    constructor(props) {
        super(props)
        this.state = {
            topRetweetedTweets: [],
            topLikedTweets: [],
            topViewedTweets: [],
        }
    }
    componentDidMount() {
        // graph for users tweet views count
        axios.get(constants.BACKEND_SERVER.URL + "/tweets/topTweetsByRetweets/" + localStorage.getItem("userId"))
            .then(response => {
                // console.log("response.data", response.data)
                const viewsgraph = []
                let result,
                    d,
                    label,
                    y
                result = response.data
                for (d in result) {
                    label = result[d]._id
                    y = result[d].retweetCount
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
                text: "Top 5 retweets",
            },
            axisY: {
                title: "Retweet count",
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
// export TopRetweeted Component
export default TopRetweeted
