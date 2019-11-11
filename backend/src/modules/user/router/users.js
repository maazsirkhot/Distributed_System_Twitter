`use strict`

import express from 'express'
let router = express.Router()
import userController from '../controller/users'
import validator from '../validator'
import validation from 'express-validation'
require('../../../middlewares/passport')
import passport from 'passport'

router.post('/signup', validation(validator['signup']), userController.createUser)
router.post('/login', validation(validator['login']), userController.loginUser)
router.get('/profile/:userId', validation(validator['getProfile']), passport.authenticate('jwt', { session: false }), userController.getUserProfile)
router.put('/profile/', validation(validator['updateProfile']) , passport.authenticate('jwt', { session: false }), userController.updateUserProfile)
router.delete('/deactivateAccount/:userId', validation(validator['deactivateProfile']) , passport.authenticate('jwt', { session: false }), userController.deactivateUserProfile)
router.post('/bookmarkTweet', validation(validator['bookmarkTweet']) , passport.authenticate('jwt', { session: false }), userController.bookmarkTweet)
router.post('/follow', validation(validator['followUser']), passport.authenticate('jwt', { session: false }), userController.followUser)

module.exports = router
