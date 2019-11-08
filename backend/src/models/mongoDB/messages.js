`use strict`

import mongoose from 'mongoose'

const Messages = new mongoose.Schema({
	participants : [{
		userId: mongoose.Types.ObjectId,
		userName : String,
		imageURL : String
	}],
	body : [{
		senderUserId : mongoose.Types.ObjectId,
		text : String,
		time : {
			type : Date,
			default : Date.now
		}
	}]
});

export default mongoose.model('messages', Messages)