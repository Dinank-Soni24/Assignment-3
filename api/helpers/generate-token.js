const jwt = require('jsonwebtoken');
module.exports = {


  friendlyName: 'Generate token',


  description: '',


  inputs: {
    email: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    expiresIn: {
      type: 'string',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },
    error: {
      description: 'Token is not generate'
    }

  },


  fn: async function (inputs) {
    try {

      const { email, password, expiresIn } = inputs;
      // generate token using jwt
      const token = jwt.sign({
        email,
        password
      },
        process.env.JWT_KEY,
        {
          expiresIn
        });
       
      return token;
    } catch (error) {
      return error;
    }
  }


};

