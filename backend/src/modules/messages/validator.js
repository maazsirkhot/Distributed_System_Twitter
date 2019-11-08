`use strict`

import Joi from 'joi'
import constants from '../../utils/constants'

module.exports = {
    sendMessage : {
        body : {
            sender : Joi.string().max(15).required(),
            receiver : Joi.string().max(15).required(),
            text : Joi.string().required()
        },
        model: 'sendMessage',
		group: "User",
		description: "Send Message from one user to other user"
    },
    getInbox : {
        body : {
            username : Joi.string().max(15).required()
        },
        model: 'getInbox',
		group: "User",
		description: "Get Full Inbox for a user"
    },
    getConversation : {
        body : {
            username1 : Joi.string().max(15).required(),
            username2 : Joi.string().max(15).required()
        },
        model: 'getIngetConversationbox',
		group: "User",
		description: "Get conversation for two participants"
    }
}