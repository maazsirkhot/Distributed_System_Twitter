import React, { Component } from 'react'
import '../../App.css'

class CommentComponent extends Component {

    differenceInPostedTime = () => {
        let Date1 = new Date(this.props.commentData.time)
        let Date2 = new Date(),
            Date3 = Date2 - Date1,
            oneDay = 1000 * 60 * 60 * 24,
            oneHour = 1000 * 60 * 60,
            oneMinute = 1000 * 60,
            oneSecond = 1000,
            postedTime,
            monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        if ((Date3 / oneDay) >= 1) {
            postedTime = Date2.getDate().toString() + " " + monthNames[Date2.getMonth()]
        } else if ((Date3 / oneHour) >= 1) {
            postedTime = Math.floor(Date3 / oneHour) + "h"
        } else if ((Date3 / oneMinute) >= 1) {
            postedTime = Math.floor(Date3 / oneMinute) + "m"
        } else if ((Date3 / oneSecond) >= 1) {
            postedTime = Math.floor(Date3 / oneSecond) + "s"
        } else {
            postedTime = "Just now"
        }
        return postedTime
    }

    render() {

        const commentTime = this.differenceInPostedTime()
        
        return (
            <div className="pt-3 pb-3">
                <div className="row">
                    <div className="col-md-1">
                        <img src={this.props.commentData.imageURL} alt="user-img" className="img-fluid" />
                    </div>
                    <div className="col-md-11">
                        <span className="font-weight-bolder">
                        <a href={"/view/profile/" + this.props.commentData.userId} className="text-dark">{this.props.commentData.userName} </a>
                        </span>
                        <span> · {commentTime}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-11 offset-md-1">{this.props.commentData.body}</div>
                </div>
            </div>
        )

    }
}
//export CommentComponent Component
export default CommentComponent