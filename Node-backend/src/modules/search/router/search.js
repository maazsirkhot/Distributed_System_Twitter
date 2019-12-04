import express from 'express';
import validation from 'express-validation';
import passport from 'passport';
import searchController from '../controller/search';
import validator from '../validator';
import ensureUser from '../../../middlewares/userTokenValidator';

'use strict';
const router = express.Router();
require('../../../middlewares/passport');

router.get('/tweet/hashtag/:hashtag', validation(validator.hashtagSearch), passport.authenticate('jwt', { session: false }), ensureUser, searchController.hashtagSearch);
router.get('/fetchProfile/:userId', validation(validator.fetchProfile), passport.authenticate('jwt', { session: false }), ensureUser, searchController.fetchProfile);

module.exports = router;
