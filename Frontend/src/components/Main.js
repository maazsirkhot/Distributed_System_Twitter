import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import {Redirect} from 'react-router';

import Landing from './Root/Landing';
import Login from './Root/Login';
import CreateAccount from './Root/CreateAccount';

import UserHome from './User/Home';

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}

                {/* Routes for user without account */}
                {/* <Route path="/" exact={ true }>
                    <Redirect to="welcome" />
                </Route> */}
                <Route path="/welcome" component={ Landing }/>
                <Route path="/login" exact={ true } component={ Login }/>
                <Route path="/create-account" exact={ true } component={ CreateAccount }/>


                <Route path="/user/home" exact={ true } component={ UserHome } />

            </div>
        )
    }
}
//Export The Main Component
export default Main;