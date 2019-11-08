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
    var data = {
        sender : req.body.sender,
        receiver : req.body.receiver,
        text : req.body.text
    }

    var senderID = await Users.findOne({username : data.sender});
    var receiverID = await Users.findOne({username : data.receiver});
    console.log(senderID, receiverID)
    
    if(senderID == null || receiverID == null){
        console.log("No Content found")
        return res.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS).send({message : constants.MESSAGES.USER_NOT_FOUND});
    }

    var participants1 = [senderID._id, receiverID._id];
    var participants2 = [receiverID._id, senderID._id]

    var messageData = {
        senderUserID : senderID._id,
        text : data.text
    }
    
    let checkConversation = await Messages.findOne({$or : [ {participants : participants1}, {participants : participants2} ] });

    if(checkConversation == null){
        let conversation = {
            participants : participants1,
            body : [messageData]
        }
        let addConversation = new Messages(conversation);
        let newConversation = await addConversation.save();
        newConversation = newConversation.toJSON();

        return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send({Message : newConversation});
    } else {
        let details = await Messages.updateOne({ $or : [ {participants : participants1}, {participants : participants2} ] }, { $push : {"body":messageData}})
        console.log(details);

        return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send({Message : details});
    }
}

/**
 * Get Inbox for a user
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getInbox = async (req, res) => {
    var data = {
        user : req.body.username
    }

    var userid = await Users.findOne({username : data.user});
    if(userid == null){
        console.log("No Content found")
        return res.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS).send({message : constants.MESSAGES.USER_NOT_FOUND});
    }

    let getInbox = await Messages.find({ participants : userid._id});
    console.log(getInbox);


    return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send({Message : getInbox});

}

/**
 * Get Conversation between two users
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getConversation = async (req, res) => {
    var data = {
        username1 : req.body.username1,
        username2 : req.body.username2
    }

    var participants1 = await Users.findOne({username : data.username1});
    var participants2 = await Users.findOne({username : data.username2});
    console.log(participants1, participants2)
    
    if(participants1 == null || participants2 == null){
        console.log("No Content found")
        return res.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS).send({Message : constants.MESSAGES.USER_NOT_FOUND});
    }

    let conversation = await Messages.findOne({$or : [ {participants : [participants1._id, participants2._id]}, {participants : [participants2._id, participants1._id]} ] });

    if(conversation == null){
        return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send({Message : constants.MESSAGES.NO_CONVERSATION});
    }

    console.log(conversation);
    return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send({Message : conversation});

}