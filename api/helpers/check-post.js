module.exports = {


  friendlyName: 'Check post',


  description: '',


  inputs: {
    id: {
      type: 'string',
      required: true
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },
    error: {
      description: 'User is not Found'
    }

  },


  fn: async function (inputs, exits) {

    try {
      const { id } = inputs;
      const post = await Post.findOne({ id: id });
      if (post) {
        return exits.success();
      } else {
        return exits.error();
      }
    } catch (error) {
      return exits.error(error);
    }
  }


};

