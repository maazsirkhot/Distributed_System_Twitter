import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import Tweet from '../tweet/tweetComponent';
import constants from '../../utils/constants';
import CanvasJSReact from '../../canvasjs/canvasjs.react';

const { CanvasJS } = CanvasJSReact;
const { CanvasJSChart } = CanvasJSReact;

class UserAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topRetweetedTweets: [],
      topLikedTweets: [],
      topViewedTweets: [],
    };
  }

  componentDidMount() {
    // get top liked tweets for rendering Chart
    axios
      .get(
        `${constants.BACKEND_SERVER.URL
				 }/tweets/topTweetsByLike/${
				 localStorage.getItem('userId')}`,
      )
      .then((response) => {
        // console.log(response.data)
        const likegraph = [];
        const result = response.data;
        for (const d in result) {
          const label = result[d]._id;
          const y = result[d].likeCount;
          const data = {
            label,
            y,
          };
          likegraph.push(data);
        }

        this.setState({
          topLikedTweets: likegraph,
        });
        // console.log(this.state.topLikedTweets)
      })
      .catch(() => {
        // console.log(err);
      });
    // get top retweeted tweets for rendering Chart
    axios
      .get(
        `${constants.BACKEND_SERVER.URL
				 }/tweets/topTweetsByRetweets/${
				 localStorage.getItem('userId')}`,
      )
      .then((response) => {
        // console.log(response.data)
        const retweetgraph = [];
        const result = response.data;
        for (const d in result) {
          const label = result[d]._id;
          const y = result[d].retweetCount;
          const data = {
            label,
            y,
          };

          retweetgraph.push(data);
        }

        this.setState({
          topRetweetedTweets: retweetgraph,
        });
        // console.log(this.state.topRetweetedTweets)
      })
      .catch(() => {
        // console.log(err);
      });
    // graph for users tweet views count
    axios.get(`${constants.BACKEND_SERVER.URL}/tweets/topTweetsByViews/${localStorage.getItem('userId')}`)
      .then((response) => {
        // console.log(response.data)
        const viewsgraph = [];
        let result;
        let d;
        let label;
        let y;
        result = response.data;
        for (d in result) {
          label = result[d]._id.tweetId;
          y = result[d].total;
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
    let topLikedTweets = [];
    let topRetweetedTweets = [];
    let topViewedTweets = [];

    if (this.state.topLikedTweets.length > 0) {
      topLikedTweets = this.state.topLikedTweets;
    }
    if (this.state.topLikedTweets.length > 0) {
      topRetweetedTweets = this.state.topRetweetedTweets;
    }
    if (this.state.topViewedTweets.length > 0) {
      topViewedTweets = this.state.topViewedTweets;
    }

    const options = {
      title: {
        text: 'Basic Column Chart',
      },
      data: [
        {
          // Change type to "doughnut", "line", "splineArea", etc.
          type: 'line',
          dataPoints: [
            { label: 'Apple', y: 10 },
            { label: 'Orange', y: 15 },
            { label: 'Banana', y: 25 },
            { label: 'Mango', y: 30 },
            { label: 'Grape', y: 28 },
          ],
        },
      ],
    };
    const options1 = {
      animationEnabled: true,
      exportEnabled: true,
      theme: 'light2',
      title: {
        text: 'Top Liked  Tweets',
      },
      axisY: {
        title: 'likeCount',
      },
      axisX: {
        title: '_id',
      },
      data: [
        {
          type: 'column',
          dataPoints: topLikedTweets,
        },
      ],
    };
    const options2 = {
      animationEnabled: true,
      exportEnabled: true,
      theme: 'light2',
      title: {
        text: 'Top Retweeted Tweets',
      },
      axisY: {
        title: 'retweetCount',
      },
      axisX: {
        title: '_id',
      },
      data: [
        {
          type: 'column',
          dataPoints: topRetweetedTweets,
        },
      ],
    };
    const options3 = {
      animationEnabled: true,
      exportEnabled: true,
      theme: 'light2',
      title: {
        text: 'Top Viewed  Tweets',
      },
      axisY: {
        title: 'View count',
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
    const x = JSON.stringify(topLikedTweets);
    return (
    // Do not modify this div properties
      <div
        className="row"
        style={{ minHeight: `${100}vh`, maxWidth: `${100}vw` }}
      >
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
        <Navbar
          isActive="Analytics"
          userName={localStorage.getItem('userName')}
          imageURL={localStorage.getItem('imageURL')}
        />

        {/* Do not modify this div properties */}
        <div className="col-md-9 shadow p-5">
          {/* <CanvasJSChart
						options={options}
					//   onRef={ref => (this.chart = ref)}
					/>
					<CanvasJSChart
						class="graph1"
						options={options1}
					// onRef={ref => (this.chart = ref)}
					/>
					<CanvasJSChart
						class="graph1"
						options={options2}
					// onRef={ref => (this.chart = ref)}
					/> */}
          <CanvasJSChart options={options3} /* onRef={ref => (this.chart = ref)} */ />
        </div>
      </div>
    );
  }
}
// export UserAnalytics Component
export default UserAnalytics;
