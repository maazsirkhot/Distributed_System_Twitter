`use strict`

import Joi from 'joi'
import constants from '../../utils/constants'

module.exports = {
    sendMessage : {
        body : {
            senderID: Joi.string().required(),
            senderUserName: Joi.string().max(15).required(),
            senderImg: Joi.string(),
            receiverID: Joi.string().required(),
            receiverUserName: Joi.string().max(15).required(),
            receiverImg: Joi.string(),
            text: Joi.string().required()
        },
        model: 'sendMessage',
		group: "User",
		description: "Send Message from one user to other user"
    },
    getInbox : {
        body : {
            userName : Joi.string().max(15).required()
        },
        model: 'getInbox',
		group: "User",
		description: "Get Full Inbox for a user"
    },
    getConversation : {
        body : {
            userName1 : Joi.string().max(15).required(),
            userName2 : Joi.string().max(15).required()
        },
        model: 'getIngetConversationbox',
		group: "User",
		description: "Get conversation for two participants"
    }
}