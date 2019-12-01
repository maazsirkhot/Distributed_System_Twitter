`use strict`

import express from 'express'
let router = express.Router()
import listController from '../controller/list'
import validator from '../validator'
import validation from 'express-validation'
require('../../../middlewares/passport')
import passport from 'passport'
import { ensureUser } from '../../../middlewares/userTokenValidator'

router.post('/', validation(validator['createList']), passport.authenticate('jwt', { session: false }), ensureUser, listController.createList)
router.get('/owned/:userId', validation(validator['getOwnedList']) , passport.authenticate('jwt', { session: false }), ensureUser, listController.getOwnedList)
router.get('/all/:userId', validation(validator['getAllList']), passport.authenticate('jwt', { session: false }), ensureUser, listController.getAllList)
router.post('/subscribe', validation(validator['subscribeList']), passport.authenticate('jwt', { session: false }), ensureUser, listController.subscribeList)
router.get('/subscribed/:userId', validation(validator['getSubscribedList']) , passport.authenticate('jwt', { session: false }), ensureUser, listController.getSubscribedList)
router.get('/members/:listId', validation(validator['getMembersOfList']) , passport.authenticate('jwt', { session: false }), ensureUser, listController.getMembersOfList)
router.get('/subscribers/:listId', validation(validator['getSubscribersOfList']) , passport.authenticate('jwt', { session: false }), ensureUser, listController.getSubscribersOfList)

module.exports = router
