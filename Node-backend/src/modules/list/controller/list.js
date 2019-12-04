'use strict'

/**
 * Create list and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createList = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.body = r.body;
	req.path = r.route.path;

	kafka.make_request('lists', req, function(err, results){
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
 * Get all the lists created by the logged in user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getOwnedList = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.body = r.body;
	req.params = r.params;
	req.path = r.route.path;

	kafka.make_request('lists', req, function(err, results){
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
 * Get all the lists created by the logged in user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getAllList = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.body = r.body;
	req.params = r.params
	req.path = r.route.path;

	kafka.make_request('lists', req, function(err, results){
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
 * Subscribe a user to a list of another user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.subscribeList = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.body = r.body;
	req.path = r.route.path;

	kafka.make_request('lists', req, function(err, results){
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
 * Get all the lists subscribed by the logged in user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getSubscribedList = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.params = r.params;
	req.path = r.route.path;

	kafka.make_request('lists', req, function(err, results){
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
 * Get all the members present in a list.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getMembersOfList = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.params = r.params;
	req.path = r.route.path;

	kafka.make_request('lists', req, function(err, results){
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
 * Get all the users subscribed to a list.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getSubscribersOfList = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.params = r.params;
	req.path = r.route.path;

	kafka.make_request('lists', req, function(err, results){
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
