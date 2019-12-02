import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import Tweet from './tweetComponent';
import Comment from './comment';
import constants from '../../utils/constants';

class ViewTweet extends Component {
  constructor() {
    super();
    this.state = {
      tweetData: {
        isRetweet: false,
        originalBody: '',
        tweetId: '',
        newComment: '',
        responseMsg: [],
        shouldReload: false,
      },
    };
  }

  componentDidUpdate(nextProps) {
    // console.log(nextProps) // NextProps is old data
    // console.log(this.props) // this props is the new data that we are going to have

    if (nextProps.location.pathname !== this.props.location.pathname) {
      axios.get(`${constants.BACKEND_SERVER.URL}/tweets/fetchTweetById/${this.props.match.params.tweetid}`)
        .then((response) => {
          // console.log(response.data)
          this.setState({
            tweetData: response.data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (this.state.shouldReload) {
      axios.get(`${constants.BACKEND_SERVER.URL}/tweets/fetchTweetById/${this.props.match.params.tweetid}`)
        .then((response) => {
          // console.log(response.data)
          this.setState({
            tweetData: response.data,
            shouldReload: false,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  componentDidMount() {
    axios.get(`${constants.BACKEND_SERVER.URL}/tweets/fetchTweetById/${this.props.match.params.tweetid}`)
      .then((response) => {
        // console.log(response.data)
        this.setState({
          tweetData: response.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

    differenceInPostedTime = () => {
      const Date1 = new Date(this.state.tweetData.tweetDate);
      const Date2 = new Date();
      const Date3 = Date2 - Date1;
      const oneDay = 1000 * 60 * 60 * 24;
      const oneHour = 1000 * 60 * 60;
      const oneMinute = 1000 * 60;
      const oneSecond = 1000;
      let postedTime;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      if ((Date3 / oneDay) >= 1) {
        postedTime = `${Date2.getDate().toString()} ${monthNames[Date2.getMonth()]}`;
      } else if ((Date3 / oneHour) >= 1) {
        postedTime = `${Math.floor(Date3 / oneHour)}h`;
      } else if ((Date3 / oneMinute) >= 1) {
        postedTime = `${Math.floor(Date3 / oneMinute)}m`;
      } else if ((Date3 / oneSecond) >= 1) {
        postedTime = `${Math.floor(Date3 / oneSecond)}s`;
      } else {
        postedTime = 'Just now';
      }
      return postedTime;
    }

    addComment = (e) => {
      let originalTweetId;
      e.preventDefault();
      originalTweetId = this.state.tweetData._id;
      const commentData = {
        tweetId: originalTweetId,
        userId: localStorage.getItem('userId'),
        userName: localStorage.getItem('userName'),
        imageURL: localStorage.getItem('imageURL'),
        body: this.state.commentData,
      };
      axios.post(`${constants.BACKEND_SERVER.URL}/tweets/addComment`, commentData)
        .then((response) => {
          if (response.status === 201) {
            this.setState({
              responseMsg: [<h2 className="fas fa-check-circle text-success"> </h2>],
              shouldReload: true,
            });
          }
        })
        .catch((err) => {
          this.setState({
            responseMsg: [<h2 className="fas fa-times-circle text-success"> </h2>],
          });
        });
      this.setState({
        commentData: '',
      });
    }

    commentChangeHandler = (e) => {
      this.setState({
        commentData: e.target.value,
      });
    }

    render() {
      const allComments = [];
      let index;

      for (index in this.state.tweetData.comments) {
        allComments.push(<Comment commentData={this.state.tweetData.comments[index]} />);
      }

      const NavbarComponent = [];
      if (localStorage.getItem('twitterToken') != null) {
        NavbarComponent.push(<Navbar isActive="" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')} />);
      } else {
        NavbarComponent.push(<div className="col-md-2 offset-md-1 pl-5 pr-5" />);
      }
      return (

      // Do not modify this div properties
        <div className="row" style={{ minHeight: `${100}vh`, maxWidth: `${100}vw` }}>
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
          {NavbarComponent}

          {/* Do not modify this div properties */}
          <div className="col-md-9 shadow pl-5 pr-5 pb-5 pt-3">
            {/* Insert UI here */}
            <div className="border-bottom">
              <h4 className="font-weight-bolder">Tweet</h4>
            </div>
            <Tweet tweetData={this.state.tweetData} />

            <div className="row pt-3 pb-3">
              <div className="col-md-1">{this.state.responseMsg}</div>
              <div className="col-md-9">
                <form>
                  <input type="text" className="form-control" value={this.state.commentData} onChange={this.commentChangeHandler} />
                </form>
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary" onClick={this.addComment}>Add comment</button>
              </div>


            </div>

            {allComments}

          </div>

        </div>
      );
    }
}
// export ViewTweet Component
export default ViewTweet;
