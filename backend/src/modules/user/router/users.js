`use strict`

import express from 'express'
let router = express.Router()
import userController from '../controller/users'
import validator from '../validator'
import validation from 'express-validation'
import { ensureUser } from '../../../middlewares/validators'
// require('../../../middlewares/validators')(passport)
// import passport from 'passport'
// var requireAuth = passport.authenticate('jwt', {session: false})

router.post('/signup', validation(validator['signup']), userController.createUser)
router.post('/login', validation(validator['login']), userController.loginUser)
router.get('/profile/:userId', validation(validator['getProfile']) , userController.getUserProfile)
router.delete('/profile/:userId', validation(validator['deactivateProfile']) , userController.deactivateUserProfile)

module.exports = router
