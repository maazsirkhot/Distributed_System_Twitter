import { verify } from 'jsonwebtoken';
import Users from '../models/mongoDB/users';
import config from '../../config';
import { getToken } from '../utils/auth';
import constants from '../utils/constants';

'use strict';

export async function ensureUser(req, res, next) {
  const token = getToken(req);
  if (!token) {
    return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS).send();
  }
  try {
    const decoded = verify(token, config.token);
    const tokenMatch = await Users.findOne({ _id: decoded.id }, { jwtToken: { $elemMatch: { token } } });

    if (!tokenMatch) {
      return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS).send();
    }

    // setting these fields to use in logout api
    // eslint-disable-next-line require-atomic-updates
    req.tokenToDelete = token;
    // eslint-disable-next-line require-atomic-updates
    req.userId = decoded.id;
  } catch (err) {
    console.log('in catch', err);
    return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS).send();
  }
  return next();
}
