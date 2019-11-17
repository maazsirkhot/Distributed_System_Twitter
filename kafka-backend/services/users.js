import Users from '../models/mongoDB/users'

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
    }
    console.log("after callback");
};

exports.handle_request = handle_request;