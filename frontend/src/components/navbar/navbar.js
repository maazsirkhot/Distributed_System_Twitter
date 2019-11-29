import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import constants from '../../utils/constants'
import axios from 'axios'
import ListGroup from 'react-bootstrap/ListGroup'


class Navbar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            searchBox: '',
            data: null
        }
    }

    renderList = () => {
        let f = []
        if(this.state.data) {
            if(this.state.searchBox[0] === '#') {
                let s = new Set()
                this.state.data.data.map((value) => {
                    let re = new RegExp(this.state.searchBox + '([a-z]|[A-Z])*')
                    let found = value.originalBody.match(re)
                    //console.log(found)
                    if(found && found[0]) {
                        s.add(found[0])
                    }
                })
                f = Array.from(s)
            } else {
                f = this.state.data.data
            }

            if(f.length > 3) {
                f = f.slice(0, 3)
            }
            //console.log('--------', f, '----------')
        }
        return <ListGroup style ={{
                    width: 75 + '%'
                }}>
            {f && f.map((value) => {
                //console.log(value)
                if(this.state.searchBox[0] === '#') {
                    let link = `/view/hashtag/${value.substr(1)}`
                    return <ListGroup.Item><Link to = {link}>{value}</Link></ListGroup.Item>
                } else {
                    let link = `/view/profile/${value._id}` // This link has to redirected to profie page, Have to change...
                    return <ListGroup.Item><Link to = {link}>{value.name + ' @' + value.userName}</Link></ListGroup.Item>
                }
            })}
        </ListGroup>
    }

    searchBoxChange = (e) => {
        let keyword = ''
        keyword += e.target.value
        this.setState({
            searchBox: keyword
        })

        if(keyword) {
            if(keyword.length == 1) {
                this.setState({
                    data: null
                })
            } else {
                if(keyword[0] === '#') {
                    if(keyword.length > 1) {
                        axios.post('http://localhost:9000/tweets/searchByHashTag', {
                            keyword: keyword
                        }, {
                            headers: {
                                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZDlmYzk3Y2FiNTVjMjRjODkyZTk3MCIsImlhdCI6MTU3NDU3Njg4Nn0.fSQum72uk8QH85Yb5OLT_SnMbIuFQMVG9WPr6MwuNak'
                            }
                        }).then(result => {
                            this.setState({
                                data: result.data
                            })
                        }).catch(error => {
                            this.setState({
                                data: null
                            })
                        })
                    }
                } else if(keyword[0] === '@') {
                    if(keyword.length > 1) {
                        axios.post('http://localhost:9000/users/searchByUserName', {
                            keyword: keyword
                        }, {
                            headers: {
                                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZDlmYzk3Y2FiNTVjMjRjODkyZTk3MCIsImlhdCI6MTU3NDU3Njg4Nn0.fSQum72uk8QH85Yb5OLT_SnMbIuFQMVG9WPr6MwuNak'
                            }
                        }).then(result => {
                            this.setState({
                                data: result.data
                            })
                        }).catch(error => {
                            this.setState({
                                data: null
                            })
                        })
                    }
                } else {
                    axios.post(`http://localhost:9000/users/searchByName`, {
                        keyword: keyword
                    }, {
                        headers: {
                            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZDlmYzk3Y2FiNTVjMjRjODkyZTk3MCIsImlhdCI6MTU3NDU3Njg4Nn0.fSQum72uk8QH85Yb5OLT_SnMbIuFQMVG9WPr6MwuNak'
                        }
                    }).then(result => {
                        this.setState({
                            data: result.data
                        })
                    }).catch(error => {
                        this.setState({
                            data: null
                        })
                    })
                }
            }
        }
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
                        
                        <input type="text" placeholder="Search" className="form-control w-75" value={this.state.searchBox} onChange={this.searchBoxChange} />
                        {this.renderList()}

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