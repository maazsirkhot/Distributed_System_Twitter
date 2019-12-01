import React, { Component } from "react"
import "../../App.css"
import CanvasJSReact from "../../canvasjs/canvasjs.react"
var CanvasJSChart = CanvasJSReact.CanvasJSChart

class MonthlyTweets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            topRetweetedTweets: [],
            topLikedTweets: [],
            topViewedTweets: [],
        }
        this.monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }

    render() {
        let viewsgraph = []
        let d,
            label,
            y
        for (d in this.props.value) {
            label = this.props.value[d]._id
            y = this.props.value[d].count
            label = this.monthNames[label]            
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
                text: "Tweets posted by month",
            },
            axisY: {
                title: "Tweet count",
            },
            axisX: {
                title: "Line",
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
