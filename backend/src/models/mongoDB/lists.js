`use strict`

import mongoose from 'mongoose'

const Lists = new mongoose.Schema({
	listName : {
		type : String,
		maxlength : 20
	},
	ownerID : mongoose.Types.ObjectId,
	noOfMembers : Number,
	membersID : [mongoose.Types.ObjectId],
	noOfSubscribers : {
		type : Number,
		default : 0
	}
})

export default mongoose.model('lists', Lists)