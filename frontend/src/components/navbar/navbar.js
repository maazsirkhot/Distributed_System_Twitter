import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import constants from '../../utils/constants'


class Navbar extends Component {

    render() {
        let redirectVar = null,
            homeURL = "/user/home",
            exploreURL = "",
            messagesURL = "",
            bookmarksURL = "",
            listsURL = "",
            profileURL = "/user/profile",
            analyticsURL = ""

        if (localStorage.getItem('twitterToken') == null) {
            redirectVar = <Redirect to="/welcome" />
        }

        return (
            <div className="col-md-3 offset-md-1 pl-5 pr-5">
                {redirectVar}

                <div className="row text-primary mt-3 mb-3">
                    <div className="col-md-2"><h1><i class="fab fa-twitter"></i></h1></div>
                </div>

                <div className={this.props.isActive.localeCompare("Home") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                    <div className="col-md-2"><h4><i class="fas fa-home"></i></h4></div>
                    <div className="col-md-10"><h4 className="font-weight-bolder">
                        <Link to={homeURL} className={this.props.isActive.localeCompare("Home") == 0 ? "text-primary" : "text-dark"}>Home</Link></h4>
                    </div>
                </div>

                <div className={this.props.isActive.localeCompare("Explore") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                    <div className="col-md-2"><h4><i class="fas fa-hashtag"></i></h4></div>
                    <div className="col-md-10"><h4 className="font-weight-bolder">
                        <Link to={exploreURL} className={this.props.isActive.localeCompare("Explore") == 0 ? "text-primary" : "text-dark"}>Explore</Link></h4>
                    </div>
                </div>

                <div className={this.props.isActive.localeCompare("Messages") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                    <div className="col-md-2"><h4><i class="fas fa-envelope"></i></h4></div>
                    <div className="col-md-10"><h4 className="font-weight-bolder">
                        <Link to={messagesURL} className={this.props.isActive.localeCompare("Messages") == 0 ? "text-primary" : "text-dark"}>Messages</Link></h4>
                    </div>
                </div>

                <div className={this.props.isActive.localeCompare("Bookmarks") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                    <div className="col-md-2"><h4><i class="fas fa-bookmark"></i></h4></div>
                    <div className="col-md-10"><h4 className="font-weight-bolder">
                        <Link to={bookmarksURL} className={this.props.isActive.localeCompare("Bookmarks") == 0 ? "text-primary" : "text-dark"}>Bookmarks</Link></h4>
                    </div>
                </div>

                <div className={this.props.isActive.localeCompare("Lists") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                    <div className="col-md-2"><h4><i class="fas fa-list-alt"></i></h4></div>
                    <div className="col-md-10"><h4 className="font-weight-bolder">
                        <Link to={listsURL} className={this.props.isActive.localeCompare("Lists") == 0 ? "text-primary" : "text-dark"}>Lists</Link></h4>
                    </div>
                </div>

                <div className={this.props.isActive.localeCompare("Profile") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                    <div className="col-md-2"><h4><i class="fas fa-user-alt"></i></h4></div>
                    <div className="col-md-10"><h4 className="font-weight-bolder">
                        <Link to={profileURL} className={this.props.isActive.localeCompare("Profile") == 0 ? "text-primary" : "text-dark"}>Profile</Link></h4>
                    </div>
                </div>

                <div className={this.props.isActive.localeCompare("Analytics") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                    <div className="col-md-2"><h4><i class="fas fa-chart-bar"></i></h4></div>
                    <div className="col-md-10"><h4 className="font-weight-bolder">
                        <Link to={analyticsURL} className={this.props.isActive.localeCompare("Analytics") == 0 ? "text-primary" : "text-dark"}>Analytics</Link></h4>
                    </div>
                </div>

                <div className="row mt-3 mb-3">
                    <div className="col-md-2"><img src={this.props.imageURL} className="img-fluid"/></div>
                    <div className="col-md-10"><h4 className="font-weight-bolder">{this.props.userName}</h4>
                    </div>
                </div>

                <input type="text" placeholder="Search" className="form-control" />

                <div className={this.props.isActive.localeCompare("Analytics") == 0 ? "row text-primary mt-3 mb-3" : "row mt-3 mb-3"}>
                    <div className="col-md-2"><h4><i class="fas fa-sign-out-alt"></i></h4></div>
                    <div className="col-md-10"><h4 className="font-weight-bolder">
                        <Link to="/logout" className="text-dark">Logout</Link></h4>
                    </div>
                </div>
            </div>
        )
    }
}
//export Navbar Component
export default Navbar