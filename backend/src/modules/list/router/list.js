`use strict`

import express from 'express'
let router = express.Router()
import listController from '../controller/list'
import validator from '../validator'
import validation from 'express-validation'
require('../../../middlewares/passport')
import passport from 'passport'

router.post('/', validation(validator['createList']), listController.createList)
router.get('/owned/:userID', validation(validator['getOwnedList']) , passport.authenticate('jwt', { session: false }), listController.getOwnedList)
router.get('/all/:userID', validation(validator['getAllList']), passport.authenticate('jwt', { session: false }), listController.getAllList)
// router.get('/subscribed', validation(validator['getSubscribedList']) , passport.authenticate('jwt', { session: false }), listController.getSubscribedList)
// router.post('/subscribe', validation(validator['subscribeList']), listController.subscribeList)

module.exports = router
