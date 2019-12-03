import Users from '../src/models/mongoDB/users'
import model from '../src/models/sqlDB/index'

import UserController from '../src/modules/user/controller/users'

async function handle_request(req, callback){
   
    console.log("Inside User kafka backend");

    console.log('------------', req.path, '----------------');

    let results;
    switch(req.path) {
      case '/signup': results = await UserController.createUser(req);
    }

    callback(null, results);
    console.log("after callback");
};

exports.handle_request = handle_request;