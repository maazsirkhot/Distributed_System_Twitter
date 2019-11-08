`use strict`

import mongoose from 'mongoose'

const Lists = new mongoose.Schema({
	listName : {
		type : String,
		maxlength : 20
	},
	ownerId : mongoose.Types.ObjectId,
	ownerName : String,
	noOfMembers : Number,
	membersID : [{
		memberId : mongoose.Types.ObjectId,
		memberName : String,
		memberImageURL : String
	}],
	noOfSubscribers : {
		type : Number,
		default : 0
	}
})

export default mongoose.model('lists', Lists)