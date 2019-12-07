
import mongoose from 'mongoose';
import Lists from '../../../models/mongoDB/lists';
import constants from '../../../utils/constants';
import db from '../../../models/sqlDB/index';
import users from '../../../models/mongoDB/users';

/**
 * Create list and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createList = async (req, res) => {
  let createdList;
  const filter = {
    ownerId: req.body.ownerId,
    listName: req.body.listName,
  };
  try {
    const list = await Lists.findOne(filter);
    if (list) {
      return res
        .status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
        .send(constants.MESSAGES.LIST_ALREADY_EXISTS);
    }
    for (let i = 0; i < req.body.membersId.length; i += 1) {
      if (req.body.membersId[i].memberId === filter.ownerId) {
        return res
          .status(constants.STATUS_CODE.UNPROCESSABLE_ENTITY_STATUS)
          .send(constants.MESSAGES.USER_CANNOT_BE_A_MEMBER_IN_LIST);
      }
    }
    const listObj = req.body;
    listObj.noOfMembers = req.body.membersId.length;
    const newList = new Lists(listObj);
    createdList = await newList.save();
    createdList = createdList.toJSON();
    return res.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS).send(createdList);
  } catch (error) {
    console.log(`Error while creating list ${error}`);
    return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message);
  }
};

/**
 * Get all the lists created by the logged in user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getOwnedList = async (req, res) => {
  try {
    const listArr = await Lists.find({ ownerId: mongoose.Types.ObjectId(req.params.userId) });
    if (listArr) {
      return res.status(200).send(listArr);
    }
    return res.status(204).send([]);
  } catch (error) {
    console.log(`Error while getting user owned lists ${error}`);
    return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message);
  }
};

/**
 * Get all the lists created by the logged in user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getAllList = async (req, res) => {
  try {
    const listArr = await Lists.find({
      ownerId: { $ne: mongoose.Types.ObjectId(req.params.userId) },
      isActive: true,
    });
    if (listArr) {
      return res.status(200).send(listArr);
    }
    return res.status(204).send([]);
  } catch (error) {
    console.log(`Error while getting other users' lists ${error}`);
    return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message);
  }
};

/**
 * Subscribe a user to a list of another user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.subscribeList = async (req, res) => {
  const filter = {
    _id: req.body.listId,
    ownerId: req.body.subscriberId,
    ownerName: req.body.subscriberName,
  };
  try {
    const list = await Lists.findOne(filter);
    if (list) {
      return res
        .status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
        .send(constants.MESSAGES.USER_CANNOT_SUSBSCRIBE_OWN_LIST);
    }

    const alreadySubscribed = await db.listSubscribers.findOne({ where: req.body });

    if (alreadySubscribed) {
      return res
        .status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
        .send(constants.MESSAGES.ALREADY_SUBSCRIBED);
    }

    const subscribeObj = req.body;
    let subscribedList = await db.listSubscribers.create(subscribeObj);
    subscribedList = subscribedList.toJSON();
    await Lists.findByIdAndUpdate(
      req.body.listId,
      {
        $inc: {
          noOfSubscribers: 1,
        },
      },
    );
    return res.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS).send(subscribedList);
  } catch (error) {
    console.log(`Error while subscribing a list ${error}`);
    return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message);
  }
};

/**
 * Get all the lists subscribed by the logged in user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getSubscribedList = async (req, res) => {
  try {
    let index;
    let listData;
    const subscribedListArr = [];
    const subscribedList = await db.listSubscribers.findAll({
      where: { subscriberId: req.params.userId },
    });
    if (subscribedList.length > 0) {
      for (index in subscribedList) {
        listData = await Lists.findOne({
          _id: mongoose.Types.ObjectId(subscribedList[index].listId),
          isActive: true,
        });
        if (listData) {
          subscribedListArr.push(listData);
        }
      }
      return res.status(200).send(subscribedListArr);
    }
    return res.status(204).send([]);
  } catch (error) {
    console.log(`Error while getting susbcribed lists of user ${error}`);
    return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message);
  }
};

/**
 * Get all the members present in a list.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getMembersOfList = async (req, res) => {
  try {
    let index;
    let listDetails = [];
    const listMembers = [];
    let member;
    listDetails = await Lists.findById(mongoose.Types.ObjectId(req.params.listId));
    for (index in listDetails.membersId) {
      member = await users.findOne({
        _id: mongoose.Types.ObjectId(listDetails.membersId[index].memberId),
        isActive: true,
      });
      if (member) {
        listMembers.push(member);
      }
    }
    if (listMembers.length > 0) {
      return res.status(200).send(listMembers);
    }
    return res.status(204).send([]);
  } catch (error) {
    console.log(`Error while getting susbcribed lists of user ${error}`);
    return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message);
  }
};

/**
 * Get all the users subscribed to a list.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getSubscribersOfList = async (req, res) => {
  try {
    let index;
    let userData;
    const subscribedListArr = [];
    const subscribedList = await db.listSubscribers.findAll({
      where: { listId: req.params.listId },
    });
    if (subscribedList.length > 0) {
      for (index in subscribedList) {
        userData = await users.findOne({
          _id: mongoose.Types.ObjectId(subscribedList[index].subscriberId),
          isActive: true,
        });
        if (userData) {
          subscribedListArr.push(userData);
        }
      }
      return res.status(200).send(subscribedListArr);
    }
    return res.status(204).send([]);
  } catch (error) {
    console.log(`Error while getting susbcribed lists of user ${error}`);
    return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message);
  }
};
