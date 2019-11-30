`use strict`

import Users from '../models/mongoDB/users'
import config from '../../config'
import { getToken } from '../utils/auth'
import { verify } from 'jsonwebtoken'
import constants from '../utils/constants'

export async function ensureUser(req, res, next) {
	console.log('in ensure user')
	const token = getToken(req)
	console.log('token: ', token)
	if (!token) {
		console.log('401 return')
		return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS).send()
	}
	try {
		let decoded = verify(token, config.token)
        console.log('decoded: ', decoded)
        let tokenMatch = await Users.findOne({ _id: decoded.id }, { jwtToken: { $elemMatch: { token: token } } })
        console.log('tokenMatch-->', tokenMatch)

        if (!tokenMatch) {
            console.log('token does not match')
			return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS).send()
		}
		
		//setting these fields to use in logout api
        req.tokenToDelete = token
        req.userId = decoded.id
	} catch (err) {
		console.log('in catch', err)
		return res.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS).send()
	}
	return next()
}
