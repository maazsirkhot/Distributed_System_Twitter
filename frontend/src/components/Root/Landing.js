import React, {Component} from 'react';
import '../../App.css';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import queryString from 'query-string';

class Landing extends Component {
    
    render(){
        
        return(
            <div className="row max-height">
                <div className="col-md-6 bg-primary">
                    <div className="row h-100">
                         <div className="col-md-12 align-self-center ml-5 text-white">
                            <h3><i class="fas fa-search"></i> Follow your interests.</h3>
                            <h3><i class="fas fa-users"></i> Hear what people are talking about.</h3>
                            <h3><i class="fas fa-comment"></i> Join the conversation.</h3>
                         </div>
                    </div>
                </div>
                <div className="col-md-6 pt-5">
                    <form>
                        <div className="row">
                            <div className="col-md-4 offset-md-1">
                                <input type="text" placeholder="Phone, email or username" className="form form-control"></input>
                            </div>
                            <div className="col-md-4">
                                <input type="password" placeholder="Password" className="form form-control"></input>
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-outline-primary">Log in</button>
                            </div>
                        </div>
                    </form>

                    <div className="row">
                        <div className=" col-md-6 offset-md-3 pt-5 mt-5 w-50">
                            <h3 className="font-weight-bolder">See what’s happening in the world right now</h3>
                            <h5 className="font-weight-bolder pt-5">Join Twitter today.</h5>
                            <div className="pt-1">
                                <a href="/create-account">
                                    <button className="btn btn-primary form-control">Sign-up</button>
                                </a>
                            </div>
                            <div className="pt-1">
                                <a href="login">
                                    <button className="btn btn-outline-primary form-control">Log in</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export Landing Component
export default Landing;