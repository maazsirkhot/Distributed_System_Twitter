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
		_id : {id : false}
	}],
	body : [{
		senderUserName : {
			type : String,
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
		_id : {id : false}
	}],
	
}, { versionKey: false });

export default mongoose.model('messages', Messages)