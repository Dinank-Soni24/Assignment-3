/* eslint-disable eol-last */
/* eslint-disable indent */
/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require("bcrypt");

module.exports = {
  signUp: async (req, res) => {
    try {
      // Get the user's preferred language
      const lang = req.getLocale();
      const { userName, email, password, roles } = req.body;
      // Upload the profilePic image
      req.file("profilePic").upload(
        {
          maxBytes: 10000000,
        },
        async (err, uploadedFiles) => {
          if (err) {
            return res.status(500)({
              message: sails.__(`pic.serverError`, { lang }),
              error: err,
            });
          }
          // If a file was uploaded, store the file descriptor in the database
          if (uploadedFiles.length > 0) {
            const avatarFd = await uploadedFiles[0].fd;
            //hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);
            // add user in database
            try {
              const newUser = await User.create({
                userName,
                email,
                password: hashedPassword,
                profilePic: avatarFd,
                followers: {},
                following: {},
                roles,
                status: "Active",
              }).fetch();
              return res.status(201).json({
                message: sails.__(`user.created`, { lang }),
                user: newUser,
              });
            } catch (error) {
              return res.status(409).json({
                error: error,
                message: {
                  message: sails.__(`user.exists`, { lang }),
                },
              });
            }
          } else {
            return res.status(404).json({
              message: {
                message: sails.__(`user.imagenotfound`, { lang }),
              },
            });
          }
        }
      );
    } catch (error) {
      return res.status(500).json({
        message: sails.__("user.notSignUp", { lang: lang }),
        error: error,
      });
    }
  },
  login: async (req, res) => {
    try {
      // Get the user's preferred language
      const lang = req.getLocale();
      // get data from body
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        return res.status(404).json({
          log: console.log(1),
          message: {
            message: sails.__(`user.notfound`, { lang }),
          },
        });
      } else if (user.status === "inActive") {
        return res.status(403).json({
          log: console.log(2),
          message: {
            message: sails.__(`user.inActive`, { lang }),
          },
        });
      } else {
        //check the password
        const checkPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (checkPassword === true) {
          try {
            const token = await sails.helpers.generateToken(
              email,
              password,
              "8h"
            );
            // console.log(token);
            // console.log(email);
            const userUpdate = await User.updateOne(
              { email },
              { token: token }
            );
            // console.log(userUpdate);
            // console.log(5);
            return res.status(200).json({
              message: sails.__("user.found", { lang: lang }),
              token: token,
            });
          } catch (error) {
            // console.log(3);
            return res.status(422).json({
              message: sails.__("user.notUpdate", { lang: lang }),
              error: error,
            });
          }
        } else {
          return res.status(404).json({
            log: console.log(1),
            message: {
              message: sails.__(`user.notfound`, { lang }),
            },
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        message: sails.__("user.notLogin", { lang: lang }),
        error: error,
      });
    }
  },
  logout: async (req, res) => {
    // Get the user's preferred language
    const lang = req.getLocale();
    try {
      // // // get user id from link
      // const { id } = await req.params;
      // const user = await User.findOne({ email: req.userData.email });
      const userUpdate = await User.updateOne(
        { email: req.userData.email },
        { token: "" }
      );
      console.log(userUpdate);
      res.status(200).json({
        message: sails.__("logoutSuccessful", { lang: lang }),
      });
    } catch (error) {
      res.status(401).json({
        message: sails.__("user.notLogout", { lang: lang }),
        error: error,
      });
    }
  },
};
