import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Root from './root/root';
import Landing from './root/landing';
import Login from './root/login';
import Logout from './root/logout';
import CreateAccount from './root/createAccount';

import UserHome from './user/home';
import UserMessages from './user/messages';
import UserBookmarks from './user/bookmarks';

import UserListsNew from './lists/newList';
import UserListsOwned from './lists/root/owned';
import UserListSubscribed from './lists/root/subscribed';
import UserListAll from './lists/root/allLists';
import UserListTweets from './lists/details/listTweets';
import UserListMembers from './lists/details/listMembers';
import UserListSubscribers from './lists/details/listSubscribers';

import UserProfile from './user/profile';
import Settings from './user/settings';
import UserAnalytics from './analytics/analytics';

import Tweet from './tweet/tweet';
import ViewProfile from './user/ViewProfile';
import UserFollowers from './user/followersOfUser';
import UserFollowing from './user/followedByUser';

import viewRetweet from './user/viewRetweet';
import viewLiked from './user/viewLiked';
import viewHashtag from './search/hashtag';
import TweetsAnalytics from './analytics/tweetsPosted';

import DeleteTweet from './tweet/deleteTweet';

// Create a Main Component
class Main extends Component {
  render() {
    return (
      <div>
        {/* Render Different Component based on Route */}

        {/* Routes for user without account */}
        <Route path="/" exact component={Root} />
        <Route path="/welcome" component={Landing} />
        <Route path="/login" exact component={Login} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/create-account" exact component={CreateAccount} />

        <Route path="/user/home" exact component={UserHome} />
        <Route path="/user/messages" exact component={UserMessages} />
        <Route path="/user/bookmarks" exact component={UserBookmarks} />
        <Route path="/user/lists/new" exact component={UserListsNew} />
        <Route path="/user/lists/owned" exact component={UserListsOwned} />
        <Route path="/user/lists/subscribed" exact component={UserListSubscribed} />
        <Route path="/user/lists/all" exact component={UserListAll} />
        <Route path="/user/lists/:listId/tweets" exact component={UserListTweets} />
        <Route path="/user/lists/:listId/members" exact component={UserListMembers} />
        <Route path="/user/lists/:listId/subscribers" exact component={UserListSubscribers} />
        <Route path="/user/profile" exact component={UserProfile} />
        <Route path="/user/settings" exact component={Settings} />
        <Route path="/user/analytics" exact component={UserAnalytics} />

        <Route path="/view/tweet/:tweetid" component={Tweet} />
        <Route path="/view/profile/:userid" component={ViewProfile} />

        <Route path="/view/myretweets" component={viewRetweet} />
        <Route path="/view/liked" component={viewLiked} />
        <Route path="/view/hashtag/:hashtag" component={viewHashtag} />
        <Route path="/view/analytics/tweets" component={TweetsAnalytics} />

        <Route path="/view/followers/:userId" component={UserFollowers} />
        <Route path="/view/following/:userId" component={UserFollowing} />

        <Route path="/delete/tweet/:tweetId" component={DeleteTweet} />

      </div>
    );
  }
}
// Export The Main Component
export default Main;
