import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import {Redirect} from 'react-router'

import Root from './root/root'
import Landing from './root/landing'
import Login from './root/login'
import Logout from './root/logout'
import CreateAccount from './root/createAccount'

import UserHome from './user/home'
import UserProfile from './user/profile'
import UserMessages from './user/messages'

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}

                {/* Routes for user without account */}
                <Route path="/" exact={ true } component={Root}/>
                <Route path="/welcome" component={ Landing }/>
                <Route path="/login" exact={ true } component={ Login }/>
                <Route path="/logout" exact={ true } component={ Logout }/>
                <Route path="/create-account" exact={ true } component={ CreateAccount }/>


                <Route path="/user/home" exact={ true } component={ UserHome } />
                <Route path="/user/profile" exact={ true } component={ UserProfile } />
                <Route path="/user/messages" exact={ true } component={ UserMessages } />

            </div>
        )
    }
}
//Export The Main Component
export default Main;