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
    'POST /user/profile': 'profileController.profile',
    'POST /user/:id/follow': 'profileController.follow',
    'POST /user/post': 'postController.postAdd',
    'POST /user/:id/like': 'postController.like',
    'POST /user/:id/comment': 'postController.comment',


};
