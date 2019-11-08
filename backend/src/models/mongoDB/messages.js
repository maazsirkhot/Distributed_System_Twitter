`use strict`

import mongoose from 'mongoose'

const Messages = new mongoose.Schema({
	participants : [{
		userId: {
			type : mongoose.Types.ObjectId,
			required: true,
		},
		userName : {
			type : String,
			required: true,
		},
		imageURL : {
			type : String,
			required: true,
		},
		required: true,
	}],
	body : [{
		senderUserId : {
			type : mongoose.Types.ObjectId,
			required: true,
		},
		text : {
			type : String,
			required: true,
		},
		time : {
			type : Date,
			default : Date.now,
		},
		required: true,
	}]
});

export default mongoose.model('messages', Messages)