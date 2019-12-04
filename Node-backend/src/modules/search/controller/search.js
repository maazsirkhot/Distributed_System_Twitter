
import _ from 'lodash';

/**
 * Search for tweets with given hashtag.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.hashtagSearch = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');

  const req = {};
  req.query = r.query;
  req.params = r.params;
  req.path = r.route.path;

  kafka.make_request('search', req, (err, results) => {
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
 * Fetch user profile details based on userid and increase the view count of it.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.fetchProfile = async (r, res) => {
  // console.log('--------------', r.route.path, '-----------------');

  const req = {};
  req.params = r.params;
  req.path = r.route.path;

  kafka.make_request('search', req, (err, results) => {
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
