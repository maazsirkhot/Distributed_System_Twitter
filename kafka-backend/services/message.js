import MessageController from '../src/modules/messages/controller/messages'

async function handle_request(req, callback){
   
    console.log("Inside User kafka backend");

    console.log('------------', req.path, '----------------');

    let results;
    switch(req.path) {
      case '/send': results = await MessageController.sendMessage(req);
      break;
      case '/newMessage': results = await MessageController.sendNewMessage(req);
      break;
      case '/inbox/:userName': results = await MessageController.getInbox(req);
      break;
      case '/conversation/:userName1/:userName2': results = await MessageController.getConversation(req);
      break;
    }

    callback(null, results);
    console.log("after callback");
};

exports.handle_request = handle_request;