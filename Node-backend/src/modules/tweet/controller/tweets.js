"use strict"

/**
 * Create tweet or retweet and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createTweet = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.body = r.body;
	req.path = r.route.path;

	kafka.make_request('tweets', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}

/**
 * Comment on a tweet or retweet and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addComment = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.body = r.body;
	req.path = r.route.path;

	kafka.make_request('tweets', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}

/**
 * Mark a tweet as deleted and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.deleteTweet = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.params = r.params;
	req.path = r.route.path;

	kafka.make_request('tweets', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}

/**
 * Fetch tweet from Database based on tweet ID.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.fetchTweetById = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.params = r.params;
	req.path = r.route.path;

	kafka.make_request('tweets', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}
/**
 * Fetch top 10 tweets based on today's date
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.topTweetsByLike = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.params = r.params;
	req.path = r.route.path;

	kafka.make_request('tweets', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}

exports.topTweetsByRetweets = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.params = r.params;
	req.path = r.route.path;

	kafka.make_request('tweets', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}

exports.topTweetsByViews = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.params = r.params;
	req.path = r.route.path;

	kafka.make_request('tweets', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}

exports.likeTweet = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.body = r.body;
	req.path = r.route.path;

	kafka.make_request('tweets', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}

exports.searchByHashTag = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.body = r.body;
	req.path = r.route.path;

	kafka.make_request('tweets', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}


exports.tweetsByMonth = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.params = r.params;
	req.path = r.route.path;

	kafka.make_request('tweets', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}

exports.tweetsByDay = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.params = r.params;
	req.path = r.route.path;

	kafka.make_request('tweets', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}

exports.tweetsByHour = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.params = r.params;
	req.path = r.route.path;

	kafka.make_request('tweets', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}