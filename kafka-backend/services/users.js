import UserController from '../src/modules/user/controller/users'
import DeleteController from '../src/modules/user/controller/removeUser'

async function handle_request (req, callback) {
  console.log('Inside User kafka backend')

  console.log('------------', req.path, '----------------')

  let results
  switch (req.path) {
    case '/signup':
      results = await UserController.createUser(req)
      break
    case '/login':
      results = await UserController.loginUser(req)
      break
    case '/profile/:userId':
      results = await UserController.getUserProfile(req)
      break
    case '/profile':
      results = await UserController.updateUserProfile(req)
      break
    case '/deactivateAccount/:userId':
      results = await UserController.deactivateUserProfile(req)
      break
    case '/bookmarkTweet':
      results = await UserController.bookmarkTweet(req)
      break
    case '/follow':
      results = await UserController.followUser(req)
      break
    case '/unFollow':
      results = await UserController.unFollowUser(req)
      break
    case '/followersOfUserId/:userId':
      results = await UserController.followersOfUserId(req)
      break
    case '/followedByUserId/:userId':
      results = await UserController.followedByUserId(req)
      break
    case '/searchByName':
      results = await UserController.searchByName(req)
      break
    case '/searchByUserName':
      results = await UserController.searchByUserName(req)
      break
    case '/findUser/:userName':
      results = await UserController.findUser(req)
      break
    case '/viewCount/:userId':
      results = await UserController.viewCount(req)
      break
    case '/logout':
      results = await UserController.logout(req)
      break
    case '/deleteUser':
      results = await DeleteController.deleteUser(req)
      break
    case '/validate':
      results = await UserController.validate(req)
      break
  }

  callback(null, results)
  console.log('after callback')
}

exports.handle_request = handle_request
