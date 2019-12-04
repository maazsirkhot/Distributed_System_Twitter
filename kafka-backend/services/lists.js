import ListController from '../src/modules/list/controller/list'

async function handle_request(req, callback){
   
    // console.log("Inside List kafka backend");

    // console.log('------------', req.path, '----------------');

    let results;
    switch(req.path) {
      case '/': results = await UserController.createList(req);
      break;
      case '/owned/:userId': results = await UserController.getOwnedList(req);
      break;
      case '/all/:userId': results = await UserController.getAllList(req);
      break;
      case '/subscribe': results = await UserController.subscribeList(req);
      break;
      case '/subscribed/:userId': results = await UserController.getSubscribedList(req);
      break;
      case '/members/:listId': results = await UserController.getMembersOfList(req);
      break;
      case '/subscribers/:listId': results = await UserController.getSubscribersOfList(req);
      break;
    }

    callback(null, results);
    // console.log("after callback");
};

exports.handle_request = handle_request;