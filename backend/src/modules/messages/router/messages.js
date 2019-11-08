`use strict`

import express from 'express'
let router = express.Router()
import messageController from '../controller/messages';
import validator from '../validator'
import validation from 'express-validation'
require('../../../middlewares/passport');
import passport from 'passport'

router.post('/send', validation(validator['sendMessage']), messageController.sendMessage);
router.get('/inbox', validation(validator['getInbox']), messageController.getInbox);
router.get('/conversation', validation(validator['getConversation']), messageController.getConversation);

module.exports = router