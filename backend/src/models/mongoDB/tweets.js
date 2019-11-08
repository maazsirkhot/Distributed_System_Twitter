`use strict`

import mongoose from 'mongoose'

const Tweets = new mongoose.Schema({
	userId : {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	userName : {
		type : String,
		required: true,
	},
	userImageURL : {
		type : String,
		required: true,
	},
	tweetDate : { 
		type : Date, 
		default: Date.now,
	},
	imageURL : String,
	isRetweet : {
		type : Boolean,
		default : false,
	},
	originalTweetId : mongoose.Types.ObjectId,
	originalUserId : mongoose.Types.ObjectId,
	originalUserName : String,
	originalUserImageURL : String,
	originalBody : { 
		type : String,
		maxlength : 280,
		required: true,
	},
	likeCount : {
		type : Number,
		default : 0,
	},
	commentCount : {
		type : Number,
		default : 0,
	},
	retweetCount : {
		type : Number,
		default : 0,
	},
	viewsCount : [{
		date : { 
			type : Date,
		},
		count : {
			type : Number,
			default : 0,
		}
	}],
	comments : [{
		userId : mongoose.Types.ObjectId,
		userName : String,
		imageURL : String,
		time : { 
			type : Date, 
			default: Date.now,
		},
		body : { 
			type : String,
			maxlength : 280,
		}
	}]
});

export default mongoose.model('tweets', Tweets)