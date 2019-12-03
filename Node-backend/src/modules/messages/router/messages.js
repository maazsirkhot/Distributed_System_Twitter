`use strict`

import express from 'express'
let router = express.Router()
import messageController from '../controller/messages';
import validator from '../validator'
import validation from 'express-validation'
require('../../../middlewares/passport');
import passport from 'passport'
import { ensureUser } from '../../../middlewares/userTokenValidator'

router.post('/send', validation(validator['sendMessage']), passport.authenticate('jwt', { session: false }), ensureUser, messageController.sendMessage);
router.post('/newMessage', validation(validator['newMessage']), passport.authenticate('jwt', { session: false }), ensureUser, messageController.sendNewMessage);
router.get('/inbox/:userName', validation(validator['getInbox']), passport.authenticate('jwt', { session: false }), ensureUser, messageController.getInbox);
router.get('/conversation/:userName1/:userName2', validation(validator['getConversation']), passport.authenticate('jwt', { session: false }), ensureUser, messageController.getConversation);

module.exports = router