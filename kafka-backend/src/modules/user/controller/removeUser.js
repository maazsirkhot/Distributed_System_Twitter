'use strict'

import Users from '../../../models/mongoDB/users'
import Tweets from '../../../models/mongoDB/tweets'
import Messages from '../../../models/mongoDB/messages'
import Lists from '../../../models/mongoDB/lists'
import constants from '../../../utils/constants'
import mongoose from 'mongoose'
import model from '../../../models/sqlDB/index'

let Sequelize = require('sequelize');
var Op = Sequelize.Op;

const responseFormer = (status, message) => {
	return {status: status, message: message}
}

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

            //Get Tweets by the user
            let allTweets = await Tweets.find({userId : mongoose.Types.ObjectId(checkUser._id)})
            console.log(allTweets);
            var tweetid = []
            allTweets.forEach(tweet => {
                tweetid.push(String(tweet._id));
            })

            //console.log(tweetid);

            //Delete likes on other tweets
            var deleteLikesOnTweets = await model.likes.destroy({
                where : {tweetId : {[Op.in] : tweetid}}
            }) 
            console.log(deleteLikesOnTweets);

            //Delete User Profile
            var deleteProfile = await Users.deleteOne({_id : mongoose.Types.ObjectId(checkUser._id)});
            console.log(deleteProfile);

            //Delete Tweets by User
            var deleteTweets = await Tweets.deleteMany({ $or : [{userId : mongoose.Types.ObjectId(checkUser._id)}, {originalUserId : mongoose.Types.ObjectId(checkUser._id)}]});
            console.log(deleteTweets);

            //Delete Message conversation by User
            var deleteMessages = await Messages.deleteMany({ participants : {$elemMatch : {userId : mongoose.Types.ObjectId(checkUser._id)}}})
            console.log(deleteMessages);

            //Delete comments on other's tweets
            var deleteComments = Tweets.updateMany({ comments : { $elemMatch : {userId : mongoose.Types.ObjectId(checkUser._id)}}}, { $pull : {comments : { userId : mongoose.Types.ObjectId(checkUser._id)}}}, {multi : true});
            console.log(deleteComments);

            //Delete Lists created by User
            var deleteLists = await Lists.deleteMany({ownerId : mongoose.Types.ObjectId(checkUser._id)});
            console.log(deleteLists);

            //Delete from other Lists and decrease member count
            var deleteFromLists = await Lists.updateMany({membersId : { $elemMatch : {memberId : mongoose.Types.ObjectId(checkUser._id)}}}, { $pull : {membersId : {memberId : mongoose.Types.ObjectId(checkUser._id)}}, "$inc" : { noOfMembers : -1}}, {multi : true});
            console.log(deleteFromLists);

            //SQL compatible id
            var id = String(checkUser._id);
            //console.log(id)

            //Delete from other's follower lists and own followers
            var deleteFollow = await model.follows.destroy({
                where : {
                    [Op.or] : [
                        {userId : id},
                        {followerId : id}
                    ]
                }
            })
            console.log(deleteFollow);

            //Delete Likes on tweets
            var deleteLikes = await model.likes.destroy({
                where : {userId : id}
            })
            console.log(deleteLikes);

            //Delete from subscriber list
            //Get all list Ids subscribed to
            var listIds = await model.listSubscribers.findAndCountAll({
                where : {
                    subscriberId : id
                }
            })
            var listIdArray = [];
            listIds.rows.forEach(row => {
                listIdArray.push(mongoose.Types.ObjectId(row.listId));
            })
            console.log(listIdArray);
            
            //Delete from subscriber list
            var deleteListSubscribers = await model.listSubscribers.destroy({
                where : {subscriberId : id}
            })

            //Decrement subscriber count for respective lists
            if(listIdArray.length > 0){
                var decSubscribers = await Lists.updateMany({_id : { $in : listIdArray}}, { "$inc" : { noOfSubscribers : -1}}, {multi : true});
            }
            console.log(deleteListSubscribers);
            return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, "Delete User Activity Completed");
        } else {
            return responseFormer(constants.STATUS_CODE.NOT_FOUND_STATUS, checkUser);
        }
    }
    catch(error){
        console.log(`Error while creating user ${error}`)
		return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error);
    }

}