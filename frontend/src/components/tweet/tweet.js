import React, { Component } from 'react'
import '../../App.css'
import axios from 'axios'
import Navbar from '../navbar/navbar'
import constants from '../../utils/constants'

class Tweet extends Component {

    processText = (text) => {
        var formattedText = [],
            index,
            textAsArray = text.split(" "),
            temp = []
        for (index = 0; index < textAsArray.length; index++) {
            temp = []
            if (textAsArray[index].startsWith("#")) {
                temp.push(<span className="text-primary"> {textAsArray[index]} </span>)
            } else if (textAsArray[index].startsWith("@")) {
                temp.push(<span className="text-primary"> {textAsArray[index]} </span>)
            } else {
                temp.push(<span> {textAsArray[index]} </span>)
            }
            formattedText.push(temp)
        }
        return formattedText
    }

    render() {
        console.log(this.props.tweetData)
        const tweetData = this.props.tweetData.originalBody
        return (
            <div className="tweetContainer border-bottom pt-2 pb-2">
                <div className="row">
                    <div className="col-md-11 offset-md-1 text-secondary"><i class="fas fa-retweet"></i> Jayasurya17 Retweeted</div>
                </div>
                <div className="row">
                    <div className="col-md-1">
                        <img src={localStorage.getItem('imageURL')} className="img-fluid" />
                    </div>
                    <div className="col-md-11"><span className="font-weight-bolder">Tweet Username </span><span> · January 1, 2000</span></div>
                </div>
                <div className="row">
                    <div className="col-md-11 offset-md-1">{this.processText(tweetData)}</div>
                </div>
                <div className="row">
                    <div className="col-md-6 offset-md-3 mt-2 mb-2"><img src="https://cdn.pixabay.com/photo/2018/05/28/22/11/message-in-a-bottle-3437294__340.jpg" className="img-fluid" /></div>
                </div>
                <div className="row mt-1">
                    <div className="col-md-3 text-center"><i class="far fa-comment"></i> 11</div>
                    <div className="col-md-3 text-center"><i class="fas fa-retweet"></i> 11</div>
                    <div className="col-md-3 text-center"><i class="far fa-heart"></i>{/*<i class="fas fa-heart"></i>*/} 11</div>
                    <div className="col-md-3 text-center"><i class="far fa-bookmark"></i>{/*<i class="fas fa-bookmark"></i>*/}</div>
                </div>
            </div>
        )
    }
}
//export Tweet Component
export default Tweet