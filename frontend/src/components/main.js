import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Redirect } from 'react-router'

import Root from './root/root'
import Landing from './root/landing'
import Login from './root/login'
import Logout from './root/logout'
import CreateAccount from './root/createAccount'

import UserHome from './user/home'
import UserMessages from './user/messages'
import UserBookmarks from './user/bookmarks'

import UserListsNew from './lists/newList'
import UserListsOwned from './lists/root/owned'
import UserListSubscribed from './lists/root/subscribed'
import UserListAll from './lists/root/allLists'
import UserListTweets from './lists/details/listTweets'
import UserListMembers from './lists/details/listMembers'
import UserListSubscribers from './lists/details/listSubscribers'

import UserProfile from './user/profile'
import Settings from './user/settings'
import UserAnalytics from './analytics/analytics'

import Tweet from './tweet/tweet'
import ViewProfile from './user/ViewProfile'

import viewRetweet from './user/viewRetweet'
import viewLiked from './user/viewLiked'
import viewHashtag from './search/hashtag'

//Create a Main Component
class Main extends Component {
    render() {
        return (
            <div>
                {/*Render Different Component based on Route*/}

                {/* Routes for user without account */}
                <Route path="/" exact={true} component={Root} />
                <Route path="/welcome" component={Landing} />
                <Route path="/login" exact={true} component={Login} />
                <Route path="/logout" exact={true} component={Logout} />
                <Route path="/create-account" exact={true} component={CreateAccount} />

                <Route path="/user/home" exact={true} component={UserHome} />
                <Route path="/user/messages" exact={true} component={UserMessages} />
                <Route path="/user/bookmarks" exact={true} component={UserBookmarks} />
                <Route path="/user/lists/new" exact={true} component={UserListsNew} />
                <Route path="/user/lists/owned" exact={true} component={UserListsOwned} />
                <Route path="/user/lists/subscribed" exact={true} component={UserListSubscribed} />
                <Route path="/user/lists/all" exact={true} component={UserListAll} />
                <Route path="/user/lists/:listId/tweets" exact={true} component={UserListTweets} />
                <Route path="/user/lists/:listId/members" exact={true} component={UserListMembers} />
                <Route path="/user/lists/:listId/subscribers" exact={true} component={UserListSubscribers} />
                <Route path="/user/profile" exact={true} component={UserProfile} />
                <Route path="/user/settings" exact={true} component={Settings} />
                <Route path="/user/analytics" exact={true} component={UserAnalytics} />

                <Route path="/view/tweet/:tweetid" component={Tweet} />
                <Route path="/view/profile/:userid" component={ViewProfile} />

                <Route path="/view/myretweets" component={viewRetweet} />
                <Route path="/view/liked" component={viewLiked} />
                <Route path="/view/hashtag/:hashtag" component={viewHashtag} />


            </div>
        )
    }
}
//Export The Main Component
export default Main;