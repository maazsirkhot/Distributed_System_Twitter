
import Messages from '../../../models/mongoDB/messages';
import Users from '../../../models/mongoDB/users';
import constants from '../../../utils/constants';

const responseFormer = (status, message) => ({ status, message });

/**
 * Send a new message from one user to another
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.sendNewMessage = async (req, res) => {
  // console.log('Send New Message');
  try {
    const sender = {
      userId: req.body.senderID,
      userName: req.body.senderUserName,
      imageURL: req.body.senderImg,
    };
    const receiver = {
      userName: req.body.receiverUserName,
    };
    const messageText = req.body.text;
    // console.log(req.body);

    const checkUser = await Users.findOne({ userName: receiver.userName, isActive: true });
    // console.log(checkUser);

    if (checkUser !== null) {
      receiver.userId = checkUser._id.toString();
      receiver.imageURL = checkUser.imageURL;

      // console.log(sender, receiver, messageText);
      const participants1 = [sender, receiver];
      const messageData = {
        senderUserName: sender.userName,
        text: messageText,
      };

      const checkConversation = await Messages.find({ 'participants.userName': { $all: [sender.userName, receiver.userName] } });
      // console.log(checkConversation);
      if (checkConversation.length === 0) {
        // console.log('No conversation found');
        const conversation = {
          participants: participants1,
          body: [messageData],
        };
        const addConversation = new Messages(conversation);
        let newConversation = await addConversation.save();
        newConversation = newConversation.toJSON();
        // console.log('New conversation added');
        return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, newConversation);
      }
      const details = await Messages.updateOne({ 'participants.userName': { $all: [sender.userName, receiver.userName] } }, { $push: { body: messageData } });
      // console.log('Conversation Updated');
      // console.log(details);

      return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, details);
    }
    // console.log('Request user does not exist');
    return responseFormer(constants.STATUS_CODE.NOT_FOUND_STATUS, 'Other user not found');
  } catch (error) {
    // console.log(`Error while sending message ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};


/**
 * Send a message from one user to another
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.sendMessage = async (req, res) => {
  try {
    const sender = {
      userId: req.body.senderID,
      userName: req.body.senderUserName,
      imageURL: req.body.senderImg,
    };
    const receiver = {
      userId: req.body.receiverID,
      userName: req.body.receiverUserName,
      imageURL: req.body.receiverImg,
    };
    const messageText = req.body.text;

    // console.log(sender, receiver, messageText);
    const participants1 = [sender, receiver];
    const messageData = {
      senderUserName: sender.userName,
      text: messageText,
    };

    const checkUser = await Users.findOne({ userName: receiver.userName, isActive: true });
    // console.log(checkUser);
    if (!checkUser) {
      return responseFormer(constants.STATUS_CODE.NO_CONTENT_STATUS, 'No Active User Found');
    }

    const checkConversation = await Messages.find({ 'participants.userName': { $all: [sender.userName, receiver.userName] } });
    // console.log(checkConversation);
    if (checkConversation.length === 0) {
      const conversation = {
        participants: participants1,
        body: [messageData],
      };
      const addConversation = new Messages(conversation);
      let newConversation = await addConversation.save();
      newConversation = newConversation.toJSON();

      return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, newConversation);
    }
    const details = await Messages.updateOne({ 'participants.userName': { $all: [sender.userName, receiver.userName] } }, { $push: { body: messageData } });
    // console.log(details);

    return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, details);
  } catch (error) {
    // console.log(`Error while sending message ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};

/**
 * Get Inbox for a user
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getInbox = async (req, res) => {
  try {
    const data = {
      userName: req.params.userName,
    };

    const getInbox = await Messages.find({
      participants: { $elemMatch: { userName: data.userName } },
    });
    // console.log(getInbox);

    return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, getInbox);
  } catch (error) {
    // console.log(`Error while getting inbox ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};

/**
 * Get Conversation between two users
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getConversation = async (req, res) => {
  try {
    const data = {
      userName1: req.params.userName1,
      userName2: req.params.userName2,
    };
    // console.log(data);

    const conversation = await Messages.findOne({
      participants: {
        $all: [
          { $elemMatch: { userName: data.userName1 } },
          { $elemMatch: { userName: data.userName2 } },
        ],
      },
    });
    if (conversation === null) {
      return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS,
        constants.MESSAGES.NO_CONVERSATION);
    }
    // console.log(conversation);
    return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, conversation);
  } catch (error) {
    // console.log(`Error while getting conversation ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};
