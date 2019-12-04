import TweetContoller from '../src/modules/tweet/controller/tweets'
import FetchTweetContoller from '../src/modules/tweet/controller/fetchTweet'

async function handle_request(req, callback){
   
    // console.log("Inside User kafka backend");

    // console.log('------------', req.path, '----------------');

    let results;
    switch(req.path) {
      case '/createTweet': results = await TweetContoller.createTweet(req);
      break;
      case '/addComment': results = await TweetContoller.addComment(req);
      break;
      case '/:tweetId': results = await TweetContoller.deleteTweet(req);
      break;
      case '/fetchTweetById/:tweetId': results = await TweetContoller.fetchTweetById(req);
      break;
      case '/fetchTweetByUserID/:userId/:taskName': results = await FetchTweetContoller.getTweets(req);
      break;
      case '/topTweetsByLike/:userId': results = await TweetContoller.topTweetsByLike(req);
      break;
      case '/topTweetsByRetweets/:userId': results = await TweetContoller.topTweetsByRetweets(req);
      break;
      case '/topTweetsByViews/:userId': results = await TweetContoller.topTweetsByViews(req);
      break;
      case '/tweetsByMonth/:userId': results = await TweetContoller.tweetsByMonth(req);
      break;
      case '/tweetsByDay/:userId/:month/:year': results = await TweetContoller.tweetsByDay(req);
      break;
      case '/tweetsByHour/:userId/:day/:month/:year': results = await TweetContoller.tweetsByHour(req);
      break;
      case '/likeTweet': results = await TweetContoller.likeTweet(req);
      break;
      case '/fetchTweetForList/:listId': results = await FetchTweetContoller.getTweetsForList(req);
      break;
      case '/searchByHashTag': results = await TweetContoller.searchByHashTag(req);
      break;
    }

    callback(null, results);
    // console.log("after callback");
};

exports.handle_request = handle_request;