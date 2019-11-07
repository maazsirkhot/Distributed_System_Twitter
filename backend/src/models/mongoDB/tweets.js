`use strict`

import mongoose from 'mongoose'

const Tweets = new mongoose.Schema({
	userID : mongoose.Types.ObjectId,
	tweetDate : { 
		type : Date, 
		default: Date.now 
	},
	imageURL : String,
	isRetweet : {
		type : Boolean,
		default : false
	},
	originalTweetID : mongoose.Types.ObjectId,
	originalUserID : mongoose.Types.ObjectId,
	originalBody : { 
		type : String,
		maxlength : 280
	},
	likeCount : {
		type : Number,
		default : 0
	},
	commentCount : {
		type : Number,
		default : 0
	},
	retweetCount : {
		type : Number,
		default : 0
	},
	viewsCount : [{
		date : { 
			type : Date 
		},
		count : {
			type : Number,
			default : 0
		}
	}],
	comments : [{
		userID : mongoose.Types.ObjectId,
		time : { 
			type : Date, 
			default: Date.now 
		},
		body : { 
			type : String,
			maxlength : 280
		}
	}]
});

export default mongoose.model('tweets', Tweets)