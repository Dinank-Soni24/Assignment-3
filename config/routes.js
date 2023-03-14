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

    'POST /user/signup': 'UserController.signup',
    'POST /user/login': 'UserController.login',
    'POST /user/logout': 'UserController.logout',

    'POST /user/profile': 'profileController.profile',
    'POST /user/password/:id': 'profileController.passwordUpdate',
    'POST /user/profile/:id/picture': 'profileController.picUpdate',
    'POST /user/:id/follow': 'profileController.follow',
    'POST /user/followers/:id': 'profileController.followers',
    'POST /user/following/:id': 'profileController.following',

    'POST /user/post': 'postController.postAdd',
    'POST /user/like': 'postController.like', //like and dislike if already like a post
    'POST /user/:id/comment': 'postController.comment',
    'GET /post': 'postController.getPost',

    'GET /user': 'adminController.getUser',
    'POST /user/status/:id': 'adminController.status',
    'POSt /user/:id/post': 'adminController.userPost'


};
