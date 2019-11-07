`use strict`

import mongoose from 'mongoose'

const Messages = new mongoose.Schema({
	participants : [{
		participant1 : mongoose.Types.ObjectId,
		participant2 : mongoose.Types.ObjectId
	}],
	body : [{
		senderUserID : mongoose.Types.ObjectId,
		text : String,
		time : {
			type : Date,
			default : Date.now
		}
	}]
});

export default mongoose.model('messages', Messages)