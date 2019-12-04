import UserController from '../src/modules/user/controller/users'

async function handle_request(req, callback){
   
    console.log("Inside User kafka backend");

    console.log('------------', req.path, '----------------');

    let results;
    switch(req.path) {
      case '/signup': results = await UserController.createUser(req);
      break;
      case '/login': results = await UserController.loginUser(req);
      break;
      case '/profile/:userId': results = await UserController.getUserProfile(req);
      break;
      case '/profile': results = await UserController.updateUserProfile(req);
      break;
      case '/deactivateAccount/:userId': results = await UserController.deactivateUserProfile(req);
      break;
    }

    callback(null, results);
    console.log("after callback");
};

exports.handle_request = handle_request;