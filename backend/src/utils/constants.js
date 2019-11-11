`use strict`

module.exports = {
	STATUS_CODE: {
		SUCCESS_STATUS: 200,
		CREATED_SUCCESSFULLY_STATUS: 201,
		ACCEPTED_STATUS: 202,
		NO_CONTENT_STATUS: 204,
		BAD_REQUEST_ERROR_STATUS: 400,
		UNAUTHORIZED_ERROR_STATUS: 401,
		FORBIDDEN_ERROR_STATUS: 403,
		NOT_FOUND_STATUS: 404,
		CONFLICT_ERROR_STATUS: 409,
		UNPROCESSABLE_ENTITY_STATUS: 422,
		INTERNAL_SERVER_ERROR_STATUS: 500,
		MOVED_PERMANENTLY: 301,
	},
	MESSAGES: {
		USER_NOT_FOUND: 'User not found',
		USER_ALREADY_EXISTS: 'User with this email id already exists',
		USER_DETAILS_ALREADY_EXISTS: 'Username, email id or phone number already exists',
		AUTHORIZATION_FAILED: 'Authorization failed',
		NO_CONVERSATION: 'No Conversation exists between users',
		LIST_ALREADY_EXISTS: 'List name already exists for this user',
		USER_CANNOT_BE_A_MEMBER_IN_LIST: 'User cannot be a member in his own list',
		USER_VALUES_MISSING: 'Either email or phone number must be provided',
		USER_CANNOT_SUSBSCRIBE_OWN_LIST: 'User cannot subscribe to his own list',
		ALREADY_SUBSCRIBED: 'User is already subscribed to this list'
	}
}
