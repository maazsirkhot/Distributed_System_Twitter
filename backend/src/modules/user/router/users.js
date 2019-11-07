`use strict`

import express from 'express'
let router = express.Router()
import userController from '../controller/users'
import validator from '../validator'
import validation from 'express-validation'
require('../../../middlewares/validators')
// require('../../../middlewares/validators')(passport)

router.post('/signup', validation(validator['signup']), userController.createUser)
router.post('/login', validation(validator['login']), userController.loginUser)
router.get('/profile/:userId', validation(validator['getProfile']), userController.getUserProfile)
router.put('/profile/', validation(validator['updateProfile']) , userController.updateUserProfile)
router.delete('/profile/:userId', validation(validator['deactivateProfile']) , userController.deactivateUserProfile)

module.exports = router
