`use strict`

import express from 'express'
let router = express.Router()
import searchController from '../controller/search'
import validator from '../validator'
import validation from 'express-validation'
require('../../../middlewares/passport')
import passport from 'passport'

router.get('/tweet/hashtag/:hashtag', validation(validator['hashtagSearch']), passport.authenticate('jwt', { session: false }), searchController.hashtagSearch)
router.get('/fetchProfile/:userId', validation(validator['fetchProfile']), passport.authenticate('jwt', { session: false }), searchController.fetchProfile)

module.exports = router
