`use strict`

import express from 'express'
let router = express.Router()
import messageController from '../controller/messages';
import validator from '../validator'
import validation from 'express-validation'
require('../../../middlewares/passport');
import passport from 'passport'

router.post('/send', validation(validator['sendMessage']), passport.authenticate('jwt', { session: false }), messageController.sendMessage);
router.get('/inbox', validation(validator['getInbox']), passport.authenticate('jwt', { session: false }), messageController.getInbox);
router.get('/conversation', validation(validator['getConversation']), passport.authenticate('jwt', { session: false }), messageController.getConversation);

module.exports = router