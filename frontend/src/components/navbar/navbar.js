import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import constants from '../../utils/constants'


class Navbar extends Component {

    search = (e) => {
        e.preventDefault()
        // SEARCH API HERE

    }

    render() {
        let redirectVar = null,
            homeURL = "/user/home",
            messagesURL = "/user/messages",
            bookmarksURL = "/user/bookmarks",
            listsURL = "/user/lists/owned",
            profileURL = "/user/profile",
            settingsURL = "/user/settings",
            analyticsURL = "/user/analytics"

        if (localStorage.getItem('twitterToken') == null) {
            redirectVar = <Redirect to="/welcome" />
        }

        return (
            <div className="col-md-2 offset-md-1 pl-5 pr-5">
                {redirectVar}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 100 + "%",
                    height: 100 + "%"
                }}>
                    <div style={{
                        position: "-webkit-sticky",
                        position: "sticky",
                        top: 20
                    }}>
                        <div className="row text-primary mt-3 mb-3">
                            <div className="col-md-2"><h1><i class="fab fa-twitter"></i></h1></div>
                        </div>

                        <div className={this.props.isActive.localeCompare("Home") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                            <div className="col-md-2"><h4><i class="fas fa-home"></i></h4></div>
                            <div className="col-md-10"><h5 className="font-weight-bolder">
                                <Link to={homeURL} className={this.props.isActive.localeCompare("Home") == 0 ? "text-primary" : "text-dark"}>Home</Link></h5>
                            </div>
                        </div>

                        <div className={this.props.isActive.localeCompare("Messages") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                            <div className="col-md-2"><h4><i class="fas fa-envelope"></i></h4></div>
                            <div className="col-md-10"><h5 className="font-weight-bolder">
                                <Link to={messagesURL} className={this.props.isActive.localeCompare("Messages") == 0 ? "text-primary" : "text-dark"}>Messages</Link></h5>
                            </div>
                        </div>

                        <div className={this.props.isActive.localeCompare("Bookmarks") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                            <div className="col-md-2"><h4><i class="fas fa-bookmark"></i></h4></div>
                            <div className="col-md-10"><h5 className="font-weight-bolder">
                                <Link to={bookmarksURL} className={this.props.isActive.localeCompare("Bookmarks") == 0 ? "text-primary" : "text-dark"}>Bookmarks</Link></h5>
                            </div>
                        </div>

                        <div className={this.props.isActive.localeCompare("Lists") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                            <div className="col-md-2"><h4><i class="fas fa-list-alt"></i></h4></div>
                            <div className="col-md-10"><h5 className="font-weight-bolder">
                                <Link to={listsURL} className={this.props.isActive.localeCompare("Lists") == 0 ? "text-primary" : "text-dark"}>Lists</Link></h5>
                            </div>
                        </div>

                        <div className={this.props.isActive.localeCompare("Profile") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                            <div className="col-md-2"><h4><i class="fas fa-user-alt"></i></h4></div>
                            <div className="col-md-10"><h5 className="font-weight-bolder">
                                <Link to={profileURL} className={this.props.isActive.localeCompare("Profile") == 0 ? "text-primary" : "text-dark"}>Profile</Link></h5>
                            </div>
                        </div>

                        <div className={this.props.isActive.localeCompare("Settings") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                            <div className="col-md-2"><h4><i class="fas fa-cog"></i></h4></div>
                            <div className="col-md-10"><h5 className="font-weight-bolder">
                                <Link to={settingsURL} className={this.props.isActive.localeCompare("Settings") == 0 ? "text-primary" : "text-dark"}>Settings</Link></h5>
                            </div>
                        </div>

                        <div className={this.props.isActive.localeCompare("Analytics") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                            <div className="col-md-2"><h4><i class="fas fa-chart-bar"></i></h4></div>
                            <div className="col-md-10"><h5 className="font-weight-bolder">
                                <Link to={analyticsURL} className={this.props.isActive.localeCompare("Analytics") == 0 ? "text-primary" : "text-dark"}>Analytics</Link></h5>
                            </div>
                        </div>

                        <div className="row mt-3 mb-3">
                            <div className="col-md-2"><img src={this.props.imageURL} className="img-fluid" /></div>
                            <div className="col-md-10"><h5 className="font-weight-bolder">{this.props.userName}</h5>
                            </div>
                        </div>
                        <form onSubmit={this.search}>
                            <input type="text" placeholder="Search" className="form-control w-75" />
                        </form>

                        <div className="row mt-3 mb-3">
                            <div className="col-md-2"><h4><i class="fas fa-sign-out-alt"></i></h4></div>
                            <div className="col-md-10"><h5 className="font-weight-bolder">
                                <Link to="/logout" className="text-dark">Logout</Link></h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export Navbar Component
export default Navbar