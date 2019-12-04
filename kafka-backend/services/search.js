import SearchController from '../src/modules/search/controller/search'

async function handle_request(req, callback){
   
    console.log("Inside Search kafka backend");

    console.log('------------', req.path, '----------------');

    let results;
    switch(req.path) {
      case '/tweet/hashtag/:hashtag': results = await SearchController.hashtagSearch(req);
      break;
      case '/fetchProfile/:userId': results = await SearchController.fetchProfile(req);
      break;
    }

    callback(null, results);
    console.log("after callback");
};

exports.handle_request = handle_request;