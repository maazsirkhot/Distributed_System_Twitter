
import kafka from '../../../../kafka/client';
/**
 * Create user and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.deleteUser = async (r, res) => {
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
      return res
        .status(results.status)
        .send(results.message);
    }
  });
};
