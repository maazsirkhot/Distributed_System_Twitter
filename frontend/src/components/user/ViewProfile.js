import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import Tweet from '../tweet/tweetComponent';
import constants from '../../utils/constants';

class ViewProfile extends Component {
  constructor() {
    super();
    this.state = {
      userFeed: [],
      userInfo: {},
      followingCount: 0,
      followersCount: 0,
      alreadyFollowing: null,
      tweetIndex: 0,
      buttonState: false,
    };
    this.count = 2;
  }

  componentDidUpdate(nextProps) {
    // console.log(nextProps) // NextProps is old data
    // console.log(this.props) // this props is the new data that we are going to have

    if (nextProps.location.pathname !== this.props.location.pathname && this.props.match.params.userid !== localStorage.getItem('userId')) {
      // console.log(this.props)
      // let userId = localStorage.getItem('userId')
      // let userName = localStorage.getItem('userName')
      const userId = this.props.match.params.userid;
      axios.get(`${constants.BACKEND_SERVER.URL}/tweets/fetchTweetByUserID/${userId}/MYTWEETS?start=0&count=${this.count}`)
        .then((response) => {
          this.setState({
            userFeed: response.data,
            tweetIndex: this.count,
            buttonState: false,
          });
        })
        .catch((err) => {
          console.log(err);
        });
      axios.get(`${constants.BACKEND_SERVER.URL}/search/fetchProfile/${userId}`)
        .then((response) => {
          this.setState({
            userInfo: response.data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
      axios.get(`${constants.BACKEND_SERVER.URL}/users/followersOfUserId/${userId}`)
        .then((response) => {
          const alreadyFollowing = response.data.rows.find((element) => element.followerId === localStorage.getItem('userId'));
          // console.log(response.data.rows)
          // console.log(localStorage.getItem('userId'))
          // console.log(alreadyFollowing)
          if (alreadyFollowing) {
            this.setState({
              alreadyFollowing: true,
            });
          } else {
            this.setState({
              alreadyFollowing: false,
            });
          }
          this.setState({
            followersCount: response.data.count,
          });
        })
        .catch((err) => {
          console.log(err);
        });
      axios.get(`${constants.BACKEND_SERVER.URL}/users/followedByUserId/${userId}`)
        .then((response) => {
          this.setState({
            followingCount: response.data.count,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

    fetchMoreTweets = (e) => {
      e.preventDefault();
      const userId = this.props.match.params.userid;
      axios.get(`${constants.BACKEND_SERVER.URL}/tweets/fetchTweetByUserID/${userId}/MYTWEETS?start=${this.state.tweetIndex}&count=${this.count}`)
        .then((response) => {
          this.setState({
            userFeed: this.state.userFeed.concat(response.data),
            tweetIndex: this.state.tweetIndex + this.count,
            buttonState: response.data.length < this.count,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    componentDidMount() {
      // console.log(this.props)
      // let userId = localStorage.getItem('userId')
      // let userName = localStorage.getItem('userName')
      const userId = this.props.match.params.userid;
      if (userId !== localStorage.getItem('userId')) {
        axios.get(`${constants.BACKEND_SERVER.URL}/tweets/fetchTweetByUserID/${userId}/MYTWEETS?start=${this.state.tweetIndex}&count=${this.count}`)
          .then((response) => {
            this.setState({
              userFeed: response.data,
              tweetIndex: this.state.tweetIndex + this.count,
            });
          })
          .catch((err) => {
            console.log(err);
          });
        axios.get(`${constants.BACKEND_SERVER.URL}/search/fetchProfile/${userId}`)
          .then((response) => {
            this.setState({
              userInfo: response.data,
            });
          })
          .catch((err) => {
            console.log(err);
          });
        axios.get(`${constants.BACKEND_SERVER.URL}/users/followersOfUserId/${userId}`, constants.TOKEN)
          .then((response) => {
            const alreadyFollowing = response.data.rows.find((element) => element.followerId === localStorage.getItem('userId'));
            // console.log(response.data.rows)
            // console.log(localStorage.getItem('userId'))
            // console.log(alreadyFollowing)
            if (alreadyFollowing) {
              this.setState({
                alreadyFollowing: true,
              });
            } else {
              this.setState({
                alreadyFollowing: false,
              });
            }
            this.setState({
              followersCount: response.data.count,
            });
          })
          .catch((err) => {
            console.log(err);
          });
        axios.get(`${constants.BACKEND_SERVER.URL}/users/followedByUserId/${userId}`, constants.TOKEN)
          .then((response) => {
            this.setState({
              followingCount: response.data.count,
            });
          })
          .catch((err) => {
            console.log(err);
          });
        axios.get(`${constants.BACKEND_SERVER.URL}/users/followedByUserId/${userId}`)
          .then((response) => {
            this.setState({
              followingCount: response.data.count,
            });
          });
      }
    }

    followClick = (e) => {
      const data = {
        userId: this.props.match.params.userid,
        followerId: localStorage.getItem('userId'),
      };
      if (this.state.alreadyFollowing) {
        axios.post(`${constants.BACKEND_SERVER.URL}/users/unFollow/`, data)
          .then((response) => {
            this.setState({
              alreadyFollowing: false,
            });
          }).catch((err) => {
            alert(err);
            console.log(err);
          });
      } else {
        axios.post(`${constants.BACKEND_SERVER.URL}/users/follow/`, data)
          .then((response) => {
            this.setState({
              alreadyFollowing: true,
            });
          }).catch((err) => {
            alert(err);
            console.log(err);
          });
      }
    }

    render() {
      console.log('---------');
      let redirectVar = null;
      if (this.props.match.params.userid === localStorage.getItem('userId')) {
        redirectVar = <Redirect to="/user/profile" />;
      }
      const allTweets = [];
      let data;
      let userLocation = '';
      for (data in this.state.userFeed) {
        allTweets.push(<Tweet tweetData={this.state.userFeed[data]} />);
      }
      if (this.state.userInfo.city) {
        userLocation = this.state.userInfo.city;
      }
      if (this.state.userInfo.state) {
        userLocation += ` ,${this.state.userInfo.state}`;
      }
      if (this.state.userInfo.zipcode) {
        userLocation += ` - ${this.state.userInfo.zipcode}`;
      }
      const loadMoreButton = [];
      if (this.state.userFeed.length > 0) {
        loadMoreButton.push(
          <div className="row pt-4">
            <div className="col-md-3 offset-md-9">
              <button className="btn btn-outline-primary w-100" onClick={this.fetchMoreTweets} disabled={this.state.buttonState}>Load more tweets</button>
            </div>
          </div>,
        );
      }
      return (
      // Do not modify this div properties
        <div className="row" style={{ minHeight: `${100}vh`, maxWidth: `${100}vw` }}>
          {redirectVar}
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
          <Navbar isActive="" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')} />

          {/* Do not modify this div properties */}
          <div className="col-md-9 shadow p-5">
            {/* Insert UI here */}
            <div className="row mb-3">
              <div className="col-md-3 text-center">
                <img src={(this.state.userInfo && this.state.userInfo.imageURL) ? this.state.userInfo.imageURL : 'https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png'} alt="User img" className="img-fluid" style={{ maxHeight: `${150}px` }} />
              </div>
              <div className="col-md-9">
                <div className="row">
                  <div className="col-md-9">
                    <h3 className="font-weight-bolder">{this.state.userInfo.name}</h3>
                    <h4 className="font-weight-lighter text-secondary">
@
                      {this.state.userInfo.userName}
                    </h4>
                  </div>
                  {this.state.alreadyFollowing ? (
                    <div className="col-md-3">
                      <button className="btn btn-outline-primary font-weight-bolder" onClick={this.followClick}>Un-Follow</button>
                    </div>
                  ) : (
                    <div className="col-md-3">
                      <button className="btn btn-outline-primary font-weight-bolder" onClick={this.followClick}>Follow</button>
                    </div>
                  )}
                </div>
                <div className="mt-2 mb-2">{this.state.userInfo.description}</div>
                <div className="mt-2 row">
                  <div className="col-md-6">
                    <h6 className="text-secondary">
                      <i className="fas fa-map-marker-alt" />
                      {' '}
                      {userLocation}
                    </h6>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-secondary">
                      <i className="fas fa-birthday-cake" />
                      {' '}
                      {this.state.userInfo.dateOfBirth}
                    </h6>
                  </div>
                </div>
                <div className="mt-2 row">
                  <div className="col-md-6">
                    <h6>
                      <a href={`/view/following/${this.props.match.params.userid}`} className="text-decoration-none">
                        <span className="font-weight-bolder text-dark">{`${this.state.followingCount} `}</span>
                        <span className="text-secondary">Following</span>
                      </a>
                    </h6>
                  </div>
                  <div className="col-md-6">
                    <h6>
                      <a href={`/view/followers/${this.props.match.params.userid}`} className="text-decoration-none">
                        <span className="font-weight-bolder text-dark">{`${this.state.followersCount} `}</span>
                        <span className="text-secondary">Followers</span>
                      </a>
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            {allTweets}

            {loadMoreButton}

          </div>

        </div>
      );
    }
}
// export ViewProfile Component
export default ViewProfile;
