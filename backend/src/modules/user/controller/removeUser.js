'use strict'

import Users from '../../../models/mongoDB/users'
import Tweets from '../../../models/mongoDB/tweets'
import Lists from '../../../models/mongoDB/lists'
import constants from '../../../utils/constants'
import mongoose from 'mongoose'
import model from '../../../models/sqlDB/index'

let Sequelize = require('sequelize');
var Op = Sequelize.Op;

/**
 * Create user and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.deleteUser = async (req, res) => {
    var userDetails = {
        userId : req.body.userId,
        userName : req.body.userName
    }
    try {
    var checkUser = await Users.findById(userDetails.userId);
    console.log(checkUser);
    //const Op = Sequelize.Op;
    if(checkUser){

        let allTweets = await Tweets.find({userId : mongoose.Types.ObjectId(checkUser._id)})
        //console.log(allTweets);
        var tweetid = []
        allTweets.forEach(tweet => {
            tweetid.push(String(tweet._id));
        })

        await model.likes.destroy({
            where : {tweetId : {[Op.in] : tweetid}}
        }) 

        //console.log(tweetid);
        //console.log(deleteLikesOnTweets);
        await Users.deleteOne({_id : mongoose.Types.ObjectId(checkUser._id)});
        //console.log(deleteProfile);

        await Tweets.deleteMany({ $or : [{userId : mongoose.Types.ObjectId(checkUser._id)}, {originalUserId : mongoose.Types.ObjectId(checkUser._id)}]});
        //console.log(deleteTweets);

        Tweets.updateMany({ comments : { $elemMatch : {userId : mongoose.Types.ObjectId(checkUser._id)}}}, { $pull : {comments : { userId : mongoose.Types.ObjectId(checkUser._id)}}}, {multi : true});
        //console.log(deleteComments);

        await Lists.deleteMany({ownerId : mongoose.Types.ObjectId(checkUser._id)});
        //console.log(deleteLists);

        await Lists.updateMany({membersId : { $elemMatch : {memberId : mongoose.Types.ObjectId(checkUser._id)}}}, { $pull : {membersId : {memberId : mongoose.Types.ObjectId(checkUser._id)}}}, {multi : true});
        //console.log(deleteFromLists);

        var id = String(checkUser._id);
        //console.log(id)
        await model.follows.destroy({
            where : {
                [Op.or] : [
                    {userId : id},
                    {followerId : id}
                ]
            }
        })
        //console.log(deleteFollow);

        await model.likes.destroy({
            where : {userId : id}
        })
        //console.log(deleteLikes);

        await model.listSubscribers.destroy({
            where : {subscriberId : id}
        })
        //console.log(deleteListSubscribers);
        
        res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(constants.MESSAGES.NO_CONVERSATION)
    } else {
        res.status(constants.STATUS_CODE.NOT_FOUND_STATUS).send(checkUser)
    }
    }
    catch(error){
        console.log(`Error while creating user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error)
    }

}