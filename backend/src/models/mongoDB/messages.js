`use strict`

import mongoose from 'mongoose'

const Messages = new mongoose.Schema({
	participants : [ mongoose.Types.ObjectId ],
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