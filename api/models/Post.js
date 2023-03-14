/**
 * Post.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    title:
    {
      type: 'string',
      required: true,
    },
    content:
    {
      type: 'string',
      required: true
    },
    image:
    {
      type: 'string',
    },
    // like:
    // {
    //   type: 'json',
    // },
    publishedDate:
    {
      type: 'number',
      defaultsTo: Date.now()
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    //one-to-many with user(one)
    createdBy:
    {
      model: 'user'
    },
    //one-to-many with comment(many)
    comments:
    {
      collection: 'comment',
      via: 'onPost'
    },
    //one-to-many with like (many)
    like:
    {
      collection: 'like',
      via: 'post'
    }

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

  },

};

