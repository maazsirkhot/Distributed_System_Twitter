'use strict'

import Messages from '../../../models/mongoDB/messages';
import Users from '../../../models/mongoDB/users';
import constants from '../../../utils/constants'

/**
 * Send a message from one user to another
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.sendMessage = async (req, res) => {
    try{
        var sender = {
            userId: req.body.senderID,
            userName: req.body.senderUserName,
            imageURL: req.body.senderImg
        }
        var receiver = {
            userId: req.body.receiverID,
            userName: req.body.receiverUserName,
            imageURL: req.body.receiverImg
        }
        var messageText = req.body.text;
        
        console.log(sender, receiver, messageText);
        var participants1 = [sender, receiver];
        var participants2 = [receiver, sender]
        var messageData = {
            senderUserName : sender.userName,
            text : messageText
        }
        
        let checkConversation = await Messages.findOne({$or : [ {participants : participants1}, {participants : participants2}] });
        console.log(checkConversation);
        if(checkConversation == null){
            let conversation = {
                participants : participants1,
                body : [messageData]
            }
            let addConversation = new Messages(conversation);
            let newConversation = await addConversation.save();
            newConversation = newConversation.toJSON();

            return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(newConversation);
        } else {
            let details = await Messages.updateOne({ $or : [ {participants : participants1}, {participants : participants2} ] }, { $push : {"body":messageData}})
            console.log(details);

            return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(details);
        }
    } catch (error) {
		console.log(`Error while sending message ${error}`)
		return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message)
	}  
}

/**
 * Get Inbox for a user
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getInbox = async (req, res) => {
    try {
        var data = {
            userName: req.params.userName
        }

        let getInbox = await Messages.find({ participants : {$elemMatch : {userName : data.userName}}});
        console.log(getInbox);

        return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(getInbox);
    } catch (error) {
		console.log(`Error while getting inbox ${error}`)
		return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message)
	}
}

/**
 * Get Conversation between two users
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getConversation = async (req, res) => {
    try {
        var data = {
            userName1 : req.params.userName1,
            userName2 : req.params.userName2
        }
        console.log(data);

        let conversation = await Messages.findOne({participants : {$all : [{$elemMatch : {userName : data.userName1}}, {$elemMatch : {userName : data.userName2}}]}})
        if(conversation == null){
            return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(constants.MESSAGES.NO_CONVERSATION);
        }
        console.log(conversation);
        return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(conversation);
    } catch (error) {
		console.log(`Error while getting conversation ${error}`)
		return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message)
	}
}