import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import constants from '../../utils/constants';

class TweetComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errMsg: '',
      successMsg: '',
      likeCount: this.props.tweetData.likeCount,
      commentCount: this.props.tweetData.commentCount,
      retweetCount: this.props.tweetData.retweetCount,
      isLiked: false,
      isRetweeted: false,
    };
  }

  componentDidMount() {
    this.setState({
      likeCount: this.props.tweetData.likeCount,
      commentCount: this.props.tweetData.commentCount,
      retweetCount: this.props.tweetData.retweetCount,
    });
  }

  componentDidUpdate() {
    if ((this.state.likeCount !== this.props.tweetData.likeCount && !this.state.isLiked)
      || this.state.commentCount !== this.props.tweetData.commentCount
      || (this.state.retweetCount !== this.props.tweetData.retweetCount
        && !this.state.isRetweeted)) {
      if (!this.state.isLiked && !this.state.isRetweeted) {
        this.setState({
          likeCount: this.props.tweetData.likeCount,
          commentCount: this.props.tweetData.commentCount,
          retweetCount: this.props.tweetData.retweetCount,
        });
      }
      this.setState({
        isLiked: false,
        isRetweeted: false,
      });
    }
  }

    processText = (tweetText) => {
      const text = tweetText.replace(/(?:\r\n|\r|\n)/g, ' ');
      const formattedText = [];
      let index;
      const textAsArray = text.split(' ');
      let temp = [];
      for (index = 0; index < textAsArray.length; index += 1) {
        temp = [];
        if (textAsArray[index].startsWith('#')) {
          temp.push(<a href={`/view/hashtag/${textAsArray[index].slice(1)}`}>
            <span className="text-primary">
              {' '}
              {textAsArray[index]}
              {' '}
            </span>
          </a>);
        } else if (textAsArray[index].startsWith('@')) {
          temp.push(<span className="text-primary">
            {' '}
            {textAsArray[index]}
            {' '}
          </span>);
        } else {
          temp.push(<span>
            {' '}
            {textAsArray[index]}
            {' '}
          </span>);
        }
        formattedText.push(temp);
      }
      return formattedText;
    }

    differenceInPostedTime = () => {
      const Date1 = new Date(this.props.tweetData.tweetDate);
      const Date2 = new Date();
      const Date3 = Date2 - Date1;
      const oneDay = 1000 * 60 * 60 * 24;
      const oneHour = 1000 * 60 * 60;
      const oneMinute = 1000 * 60;
      const oneSecond = 1000;
      let postedTime;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      if ((Date3 / oneDay) >= 1) {
        postedTime = `${Date1.getDate().toString()} ${monthNames[Date1.getMonth()]}`;
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

    postRetweet = (e) => {
      e.preventDefault();
      const retweetData = {
        isRetweet: true,
        userId: localStorage.getItem('userId'),
        tweetId: this.props.tweetData._id,
        userName: localStorage.getItem('userName'),
        userImageURL: localStorage.getItem('imageURL'),
      };
      axios.post(`${constants.BACKEND_SERVER.URL}/tweets/createTweet`, retweetData)
        .then((response) => {
          if (response.status === 201) {
            this.setState({
              errMsg: '',
              successMsg: 'Retweet posted',
              retweetCount: this.state.retweetCount + 1,
              isRetweeted: true,
            });
          }
        })
        .catch(() => {
          this.setState({
            errMsg: 'Error in retweeting',
            successMsg: '',
          });
        });
    }

    likeTweet = (e) => {
      e.preventDefault();
      const likeData = {
        userId: localStorage.getItem('userId'),
        tweetId: this.props.tweetData._id,
      };
      axios.post(`${constants.BACKEND_SERVER.URL}/tweets/likeTweet`, likeData)
        .then(() => {
          this.setState({
            errMsg: '',
            successMsg: 'Liked tweet',
            likeCount: this.state.likeCount + 1,
            isLiked: true,
          });
        })
        .catch((err) => {
          if (err.response.status === 400) {
            this.setState({
              errMsg: 'You have already liked this tweet',
              successMsg: '',
            });
          } else {
            this.setState({
              errMsg: 'Error in liking the tweet',
              successMsg: '',
            });
          }
        });
    }

    bookmarkTweet = (e) => {
      e.preventDefault();
      const bookmarkData = {
        userId: localStorage.getItem('userId'),
        tweetId: this.props.tweetData._id,
      };
      axios.post(`${constants.BACKEND_SERVER.URL}/users/bookmarkTweet`, bookmarkData)
        .then((response) => {
          if (response.status === 201) {
            this.setState({
              errMsg: '',
              successMsg: 'Bookmark added',
            });
          } else {
            this.setState({
              errMsg: 'You have already bookmarked this tweet',
              successMsg: '',
            });
          }
        })
        .catch(() => {
          this.setState({
            errMsg: 'You have already bookmarked this tweet',
            successMsg: '',
          });
        });
    }

    IsValueEmpty = (Value) => {
      if (Value === null || Value === undefined) {
        return true;
      }
      if (''.localeCompare(Value.replace(/\s/g, '')) === 0) return true;
      return false;
    }

    render() {
      const tweetDeleteButton = [];
      if (this.props.tweetData.userId === localStorage.getItem('userId') && window.location.pathname === `/view/tweet/${this.props.tweetData._id}`) {
        tweetDeleteButton.push(
          <a href={`/delete/tweet/${this.props.tweetData._id}`}>
            <button type="button" className="btn btn-outline-danger form-control">Delete</button>
          </a>,
        );
      }

      const tweetPostedTime = this.differenceInPostedTime();
      const processedTweetBody = this.processText(this.props.tweetData.originalBody);

      const tweetUserData = [];
      let retweetUserName;
      if (this.props.tweetData.isRetweet) {
        if (this.props.tweetData.userId === localStorage.getItem('userId')) {
          retweetUserName = 'You';
        } else {
          retweetUserName = this.props.tweetData.userName;
        }
        tweetUserData.push(
          <div className="row">
            <div className="col-md-11 offset-md-1 text-secondary">
              <i className="fas fa-retweet" />
              <a href={`/view/profile/${this.props.tweetData.userId}`} className="text-secondary">{retweetUserName}</a>
              {' Retweeted'}
            </div>
          </div>,
        );
        tweetUserData.push(
          <div className="row">
            <div className="col-md-1">
              <img src={this.props.tweetData.originalUserImageURL} alt="user-img" className="img-fluid" />
            </div>
            <div className="col-md-9">
              <span className="font-weight-bolder">
                <a href={`/view/profile/${this.props.tweetData.originalUserId}`} className="text-dark">{this.props.tweetData.originalUserName}</a>
              </span>
              <span>
                {' '}
·
                {tweetPostedTime}
              </span>
              <span className="text-danger">
                {' '}
                {this.state.errMsg}
              </span>
              <span className="text-success">
                {' '}
                {this.state.successMsg}
              </span>
            </div>
            <div className="col-md-2">
              {tweetDeleteButton}
            </div>
          </div>,
        );
      } else {
        tweetUserData.push(
          <div className="row">
            <div className="col-md-1">
              <img src={this.props.tweetData.userImageURL} alt="user-img" className="img-fluid" />
            </div>
            <div className="col-md-9">
              <span className="font-weight-bolder">
                <a href={`/view/profile/${this.props.tweetData.userId}`} className="text-dark">{this.props.tweetData.userName}</a>
              </span>
              <span>
                {' '}
·
                {tweetPostedTime}
              </span>
              <span className="text-danger">
                {' '}
                {this.state.errMsg}
              </span>
              <span className="text-success">
                {' '}
                {this.state.successMsg}
              </span>
            </div>
            <div className="col-md-2">
              {tweetDeleteButton}
            </div>
          </div>,
        );
      }
      const tweetImage = [];
      if (!this.IsValueEmpty(this.props.tweetData.imageURL)) {
        tweetImage.push(
          <div className="col-md-6 offset-md-3 mt-2 mb-2 text-center">
            <img src={this.props.tweetData.imageURL} alt="user-img" className="img-fluid" style={{ maxHeight: `${150}px` }} />
          </div>,
        );
      }

      return (
        <a href={`/view/tweet/${this.props.tweetData._id}`} style={{ textDecoration: 'none' }} className="text-dark">
          <div className="tweetContainer border-bottom pt-2 pb-2">

            {/* Display user data for tweet */}
            {tweetUserData}

            {/* Display tweet body */}
            <div className="row">
              <div className="col-md-11 offset-md-1">{processedTweetBody}</div>
            </div>

            {/* Display tweet image */}
            <div className="row">
              {tweetImage}
            </div>

            {/* Display tweet comment, retweet and like counts  */}
            <div className="row mt-1">
              <div className="col-md-3 text-center">
                <i className="far fa-comment" />
                {' '}
                {this.state.commentCount}
              </div>
              <div className="col-md-3 text-center">
                <div role="button" className="text-dark" onClick={this.postRetweet} onKeyPress={this.postRetweet}>
                  <i className="fas fa-retweet" />
                  {' '}
                  {this.state.retweetCount}
                </div>
              </div>
              <div className="col-md-3 text-center">
                <div role="button" className="text-dark" onClick={this.likeTweet} onKeyPress={this.likeTweet}>
                  <i className="far fa-heart" />
                  {/* <i class="fas fa-heart"></i> */}
                  {' '}
                  {this.state.likeCount}
                </div>
                {' '}
              </div>
              <div className="col-md-3 text-center">
                <div role="button" className="text-dark" onClick={this.bookmarkTweet} onKeyPress={this.bookmarkTweet}>
                  <i className="far fa-bookmark" />
                  {/* <i class="fas fa-bookmark"></i> */}
                </div>
              </div>
            </div>

          </div>
        </a>
      );
    }
}
// export TweetComponent Component
export default TweetComponent;
