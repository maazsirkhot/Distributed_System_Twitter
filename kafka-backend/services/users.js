import Users from '../src/models/mongoDB/users'
import model from '../src/models/sqlDB/index'

async function handle_request(msg, callback){
   
    console.log("Inside book kafka backend");
    console.log(msg);

    if(msg.endPoint == '/users/searchByName') {
        try {
            let result = await Users.find({
              name: { $regex: msg.keyword, $options: "i" },
            },{
              _id: 1,
              name: 1,
              userName: 1
            })
            
            let resultObject = {
              count: result.length,
              data: result,
              status: 200
            }
            callback(null, resultObject)
        } catch(error) {
            console.log(`error while searching by Profile name ${error}`)
            callback(null, {status : 500})
        }
    } else if(msg.endPoint == '/users/followersOfUserId') {
      try {
        let result = await model.follows.findAndCountAll({
          where: {
            userId: msg.params.userId
          }
        })
        
        let resultObject = {
          data: result,
          status: 200
        }
        callback(null, resultObject)
      } catch (error) {
        console.log(`error while getting  followers of given UserId ${error}`)
        callback(null, {status : 500})
      }
    }
    console.log("after callback");
};

exports.handle_request = handle_request;