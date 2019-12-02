import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import constants from '../../utils/constants';
import CanvasJSReact from '../../canvasjs/canvasjs.react';

const { CanvasJSChart } = CanvasJSReact;

class MonthlyTweets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dailyData: {},
      prevProp: null,
    };
    this.monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  componentDidMount() {
    if (this.props.value) {
      axios.get(`${constants.BACKEND_SERVER.URL}/tweets/tweetsByDay/${localStorage.getItem('userId')}/${this.props.value}/2019`)
        .then((response) => {
          this.setState({
            dailyData: response.data,
          });
        });
    }
  }

  componentDidUpdate() {
    if (this.props.value !== this.state.prevProp) {
      axios.get(`${constants.BACKEND_SERVER.URL}/tweets/tweetsByDay/${localStorage.getItem('userId')}/${this.props.value}/2019`)
        .then((response) => {
          this.setState({
            dailyData: response.data,
            prevProp: this.props.value,
          });
        });
    }
  }

  render() {
    const viewsgraph = [];
    let d;
    let label;
    let y;
    for (d in this.state.dailyData) {
      label = d;
      y = this.state.dailyData[d];
      const data = {
        label,
        y,
      };
      viewsgraph.push(data);
    }
    const topViewedTweets = viewsgraph;
    const options = {
      animationEnabled: true,
      exportEnabled: false,
      theme: 'light2',
      title: {
        text: `Tweets in ${this.props.month}`,
        fontSize: 25,
        fontWeight: 'bolder',
        // fontColor: "#007bff",
      },
      axisY: {
        title: 'Tweet count',
      },
      axisX: {
        title: 'Day of month',
      },
      data: [
        {
          type: 'line',
          dataPoints: topViewedTweets,
        },
      ],
    };
    return (
      <div className="pt-5 pb-5">
        <CanvasJSChart options={options} /* onRef={ref => (this.chart = ref)} */ />
      </div>
    );
  }
}
// export MonthlyTweets Component
export default MonthlyTweets;
