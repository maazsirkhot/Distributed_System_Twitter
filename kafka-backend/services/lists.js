import ListController from '../src/modules/list/controller/list'

async function handle_request(req, callback){
   
    // console.log("Inside List kafka backend");

    // console.log('------------', req.path, '----------------');

    let results;
    switch(req.path) {
      case '/': results = await ListController.createList(req);
      break;
      case '/owned/:userId': results = await ListController.getOwnedList(req);
      break;
      case '/all/:userId': results = await ListController.getAllList(req);
      break;
      case '/subscribe': results = await ListController.subscribeList(req);
      break;
      case '/subscribed/:userId': results = await ListController.getSubscribedList(req);
      break;
      case '/members/:listId': results = await ListController.getMembersOfList(req);
      break;
      case '/subscribers/:listId': results = await ListController.getSubscribersOfList(req);
      break;
    }

    callback(null, results);
    // console.log("after callback");
};

exports.handle_request = handle_request;