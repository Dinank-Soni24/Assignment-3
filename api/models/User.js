/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const { Roles, Status } = sails.config.constant;


module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    userName:
    {
      type: 'string',
      required: true,
      unique: true
    },
    email:
    {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true
    },
    password:
    {
      type: 'string',
      required: true,
    },
    profilePic:
    {
      type: 'string',
      required: true,
    },
    roles:
    {
      type: 'string',
      isIn: [Roles.Admin, Roles.User],
      defaultsTo: Roles.User
    },
    // followers:
    // {
    //   type: 'json',
    // },
    // following:
    // {
    //   type: 'json',
    // },
    token:
    {
      type: 'string',
    },
    status:
    {
      type: 'string',
      isIn: [Status.Active, Status.inActive],
      defaultsTo: Roles.Active,
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    //one-to-many with post(many)
    posts:
    {
      collection: 'post',
      via: 'createdBy',
    },
    //one-to-many with comment(many)
    comments:
    {
      collection: 'comment',
      via: 'userName',
    },
    //one-to-one with like
    like:
    {
      collection:'like',
      via: 'userName'
    },
    //one-to-many with following
    following:
    {
      collection:'following',
      via: 'userId'
    },
    //one-to-many with follower
    follower:
    {
      collection:'follower',
      via:'userId'
    }
    // //many-to-many with following
    // followedId:
    // {
    //   collection:'following',
    //   via: 'followed'
    // }


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

  },

};

