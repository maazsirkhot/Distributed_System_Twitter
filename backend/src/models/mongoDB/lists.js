`use strict`

import mongoose from 'mongoose'

const Lists = new mongoose.Schema({
	listName : {
		type : String,
		maxlength : 20,
		required: true,
	},
	listDescription : {
		type : String,
	},
	ownerId : {
		type : mongoose.Types.ObjectId,
		required: true,
	},
	ownerName : {
		type : String,
		required: true,
	},
	ownerUserName : {
		type : String,
		required: true,
	},
	ownerImage : {
		type : String,
		required: true,
	},
	noOfMembers : Number,
	membersId : [{
		memberId : mongoose.Types.ObjectId,
		memberName : String,
		memberImageURL : String,
	}],
	noOfSubscribers : {
		type : Number,
		default : 0,
	}
}, { versionKey: false })

export default mongoose.model('lists', Lists)