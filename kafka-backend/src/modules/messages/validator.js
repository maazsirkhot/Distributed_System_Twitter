import Joi from 'joi';

'use strict';

module.exports = {
  sendMessage: {
    body: {
      senderID: Joi.string().required(),
      senderUserName: Joi.string().max(15).required(),
      senderImg: Joi.string(),
      receiverID: Joi.string().required(),
      receiverUserName: Joi.string().max(15).required(),
      receiverImg: Joi.string(),
      text: Joi.string().required(),
    },
    model: 'sendMessage',
    group: 'User',
    description: 'Send Message from one user to other user',
  },
  getInbox: {
    path: {
      userName: Joi.string().max(15).required(),
    },
    model: 'getInbox',
    group: 'User',
    description: 'Get Full Inbox for a user',
  },
  getConversation: {
    path: {
      userName1: Joi.string().max(15).required(),
      userName2: Joi.string().max(15).required(),
    },
    model: 'getIngetConversationbox',
    group: 'User',
    description: 'Get conversation for two participants',
  },
  newMessage: {
    body: {
      senderID: Joi.string().required(),
      senderUserName: Joi.string().max(15).required(),
      senderImg: Joi.string(),
      receiverUserName: Joi.string().max(15).required(),
      text: Joi.string().required(),
    },
    model: 'newMessage',
    group: 'User',
    description: 'Send a new Message from one user to other user',
  },
};
