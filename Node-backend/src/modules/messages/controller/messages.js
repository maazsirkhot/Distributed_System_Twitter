
import kafka from '../../../../kafka/client';

/**
 * Send a new message from one user to another
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.sendNewMessage = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');

  const req = {};
  req.body = r.body;
  req.path = r.route.path;

  kafka.make_request('messages', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res
        .status(results.status)
        .send(results.message);
    }
  });
};


/**
 * Send a message from one user to another
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.sendMessage = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');

  const req = {};
  req.body = r.body;
  req.path = r.route.path;

  kafka.make_request('messages', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res
        .status(results.status)
        .send(results.message);
    }
  });
};

/**
 * Get Inbox for a user
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getInbox = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');

  const req = {};
  req.params = r.params;
  req.path = r.route.path;

  kafka.make_request('messages', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res
        .status(results.status)
        .send(results.message);
    }
  });
};

/**
 * Get Conversation between two users
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getConversation = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');

  const req = {};
  req.params = r.params;
  req.path = r.route.path;

  kafka.make_request('messages', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log('Inside else');
      return res
        .status(results.status)
        .send(results.message);
    }
  });
};
