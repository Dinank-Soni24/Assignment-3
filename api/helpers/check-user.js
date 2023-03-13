module.exports = {


  friendlyName: 'Check user',


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

  },


  fn: async function (inputs, exits) {
    
    try {
      const { id } = inputs;
      const user = await User.findOne({ id: id });
      if (user) {
        return exits.success();
      } else {
        return exits.error();
      }
    } catch (error) {
      return exits.error(error);
    }

  }


};

