
import mongoose from 'mongoose';
import uuidv1 from 'uuid/v1';
import Users from '../../../models/mongoDB/users';
import Tweet from '../../../models/mongoDB/tweets';
import List from '../../../models/mongoDB/lists';
import Messages from '../../../models/mongoDB/messages';
import constants from '../../../utils/constants';
import model from '../../../models/sqlDB/index';
import client from '../../../models/redisClient/redis';
import updatePassword from '../../../utils/updateHashPassword';
import kafka from '../../../../kafka/client';

/**
 * Create user and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createUser = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');

  const req = {};
  req.body = r.body;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

/**
 * Login user and send auth token and user details in response.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.loginUser = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');

  const req = {};
  req.body = r.body;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

/**
 * Get user profile details based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getUserProfile = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');

  const req = {};
  req.params = r.params;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

/**
 * Update user details based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.updateUserProfile = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');

  const req = {};
  req.body = r.body;
  req.file = r.file;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

/**
 * Deactive user based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.deactivateUserProfile = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');
  const req = {};
  req.params = r.params;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

/**
 * Bookmark a tweet or retweet and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.bookmarkTweet = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');
  const req = {};
  req.body = r.body;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

exports.followUser = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');
  const req = {};
  req.body = r.body;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

exports.unFollowUser = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');
  const req = {};
  req.body = r.body;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

exports.followersOfUserId = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');
  const req = {};
  req.params = r.params;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

exports.followedByUserId = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');
  const req = {};
  req.params = r.params;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

exports.searchByName = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');
  const req = {};
  req.body = r.body;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

exports.searchByUserName = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');
  const req = {};
  req.body = r.body;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

exports.findUser = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');
  const req = {};
  req.params = r.params;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

exports.viewCount = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');
  const req = {};
  req.params = r.params;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

exports.logout = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');
  const req = {};
  req.params = r.params;
  req.userId = r.userId;
  req.tokenToDelete = r.tokenToDelete;
  req.path = r.route.path;

  kafka.make_request('users', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res.status(results.status).send(results.message);
    }
  });
};

exports.validate = async (req, res) => res.status(200).json();
