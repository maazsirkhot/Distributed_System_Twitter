import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import constants from '../../utils/constants';
import CanvasJSReact from '../../canvasjs/canvasjs.react';

const { CanvasJSChart } = CanvasJSReact;

class TopRetweeted extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topRetweetedTweets: [],
      topLikedTweets: [],
      topViewedTweets: [],
    };
  }

  componentDidMount() {
    // graph for users tweet views count
    axios.get(`${constants.BACKEND_SERVER.URL}/tweets/topTweetsByRetweets/${localStorage.getItem('userId')}`)
      .then((response) => {
        // console.log("response.data", response.data)
        const viewsgraph = [];
        let result;
        let d;
        let label;
        let y;
        result = response.data;
        for (d in result) {
          label = result[d]._id;
          y = result[d].retweetCount;
          if (y > 0) {
            const data = {
              label,
              y,
            };
            viewsgraph.push(data);
          }
        }

        this.setState({
          topViewedTweets: viewsgraph,
        });
        // console.log(this.state.topViewedTweets)
      })
      .catch(() => {
        // console.log(err);
      });
  }

  render() {
    const { topViewedTweets } = this.state;
    const options = {
      animationEnabled: true,
      exportEnabled: false,
      theme: 'light2',
      title: {
        text: 'Top 5 retweets',
      },
      axisY: {
        title: 'Retweet count',
      },
      axisX: {
        title: 'Tweet IDs',
      },
      data: [
        {
          type: 'column',
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
// export TopRetweeted Component
export default TopRetweeted;
