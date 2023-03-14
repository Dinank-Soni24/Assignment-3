/* eslint-disable indent */
/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

    'POST /user/signup': 'UserController.signup', //user signup
    'POST /user/login': 'UserController.login', //user/admin login
    'POST /user/logout': 'UserController.logout', //user/admin logout

    'POST /user/profile': 'profileController.profile', //search profile for particular user
    'POST /user/password': 'profileController.passwordUpdate', //update user password
    'POST /user/profile/picture': 'profileController.picUpdate', //update user profilePicture
    'POST /user/follow': 'profileController.follow', // follow unFollow user
    'POST /user/followers': 'profileController.followers', // view followers
    'POST /user/following': 'profileController.following', // view following

    'POST /user/post/create': 'postController.postAdd', //create post
    'POST /user/like': 'postController.like', //like and dislike if already like a post
    'POST /user/comment': 'postController.comment', //add comment on post
    'GET /post': 'postController.getPost', //get all post

    'GET /user': 'adminController.getUser', // get all user
    'POST /user/status': 'adminController.status', // update user status
    'POST /user/post': 'adminController.userPost' // get all  post from specific user


};
