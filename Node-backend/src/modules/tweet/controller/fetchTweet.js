
import kafka from '../../../../kafka/client';
/**
 * Fetch Tweets based on userId for various scenarios
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getTweets = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');

  const req = {};
  req.params = r.params;
  req.path = r.route.path;
  req.query = r.query;

  kafka.make_request('tweets', req, (err, results) => {
    // console.log(results);
    if (err) {
      // console.log("Inside err");
      res.json({
        status: 'error',
        msg: 'System Error, Try Again.',
      });
    } else {
      // console.log("Inside else");
      return res
        .status(results.status)
        .send(results.message);
    }
  });
};

/**
 * Fetch Tweets based on Subscriber Feed for various scenarios
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getSubscriberTweets = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');

  const req = {};
  req.params = r.params;
  req.path = r.route.path;

  kafka.make_request('tweets', req, (err, results) => {
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
 * Get all tweets posted by all members present in a list.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getTweetsForList = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');

  // console.log('--------------', r.route.path, '-----------------');

  const req = {};
  req.query = r.query;
  req.params = r.params;
  req.path = r.route.path;

  kafka.make_request('tweets', req, (err, results) => {
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
