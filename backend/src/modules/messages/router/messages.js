import express from 'express';
import validation from 'express-validation';
import passport from 'passport';
import messageController from '../controller/messages';
import validator from '../validator';
import { ensureUser } from '../../../middlewares/userTokenValidator';

'use strict';
const router = express.Router();
require('../../../middlewares/passport');

router.post('/send', validation(validator.sendMessage), passport.authenticate('jwt', { session: false }), ensureUser, messageController.sendMessage);
router.post('/newMessage', validation(validator.newMessage), passport.authenticate('jwt', { session: false }), ensureUser, messageController.sendNewMessage);
router.get('/inbox/:userName', validation(validator.getInbox), passport.authenticate('jwt', { session: false }), ensureUser, messageController.getInbox);
router.get('/conversation/:userName1/:userName2', validation(validator.getConversation), passport.authenticate('jwt', { session: false }), ensureUser, messageController.getConversation);

module.exports = router;
