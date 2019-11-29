`use strict`

import express from 'express'
let router = express.Router()
import userController from '../controller/users'
import validator from '../validator'
import validation from 'express-validation'
require('../../../middlewares/passport')
import passport from 'passport'
import upload from '../../../middlewares/imageUpload'

router.post('/signup', validation(validator['signup']), userController.createUser)
router.post('/login', validation(validator['login']), userController.loginUser)
router.get('/profile/:userId', validation(validator['getProfile']), passport.authenticate('jwt', { session: false }), userController.getUserProfile)
router.put('/profile/', upload.single('image'), validation(validator['updateProfile']) , passport.authenticate('jwt', { session: false }), userController.updateUserProfile)
router.delete('/deactivateAccount/:userId', validation(validator['deactivateProfile']) , passport.authenticate('jwt', { session: false }), userController.deactivateUserProfile)
router.post('/bookmarkTweet', validation(validator['bookmarkTweet']) , passport.authenticate('jwt', { session: false }), userController.bookmarkTweet)
router.post('/follow', validation(validator['followUser']), passport.authenticate('jwt', { session: false }), userController.followUser)
router.post('/unFollow', validation(validator['unFollowUser']), passport.authenticate('jwt', { session: false }), userController.unFollowUser)
router.get('/followersOfUserId/:userId', validation(validator['followersOfUserId']), /*passport.authenticate('jwt', { session: false }),*/ userController.followersOfUserId)
router.get('/followedByUserId/:userId', validation(validator['followedByUserId']), passport.authenticate('jwt', { session: false }), userController.followedByUserId)
router.post('/searchByName',validation(validator['searchByName']), /*passport.authenticate('jwt', { session: false }),*/ userController.searchByName)
router.post('/searchByUserName',validation(validator['searchByUserName']), passport.authenticate('jwt', { session: false }), userController.searchByUserName)
router.get('/findUser/:userName', validation(validator['getProfile']), passport.authenticate('jwt', { session: false }), userController.findUser)
router.get('/viewCount/:userId', validation(validator['viewCount']), passport.authenticate('jwt', { session: false }), userController.viewCount)
router.put('/logout',  validation(validator['logout']), passport.authenticate('jwt', { session: false }), userController.logout)
module.exports = router
