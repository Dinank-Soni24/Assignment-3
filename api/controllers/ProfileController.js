/* eslint-disable indent */
/**
 * ProfileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  profile: async (req, res) => {
    // Get the user's preferred language
    const lang = req.getLocale();
    try {
      const id = await req.body.id;
      //check user is exists or not
      await sails.helpers.checkUser(id);
      const user = await User.findOne({ id });
      return res.status(200).json({
        message: sails.__(`user.profileFound`, { lang }),
        user: {
          userName: user.userName,
          email: user.email,
          profilePic: user.profilePic,
          roles: user.roles,
          followers: Object.values(user.followers).length,
          following: Object.values(user.following).length,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: sails.__("user.notViewProfile", { lang: lang }),
        error: error,
      });
    }
  },
  passwordUpdate: async (req, res) => {
    // Get the user's preferred language
    const lang = req.getLocale();
    try {
      const id = req.userData.id;
      const password = req.body.password;
      // const user = await User.findOne({ id: id });
      //check user is exists or not
      await sails.helpers.checkUser(id);
      await User.updateOne({ id: id }, { password: password });
      return res.status(200).json({
        user: {
          message: sails.__("user.UpdatePassword", { lang: lang }),
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: sails.__("user.notUpdatePassword", { lang: lang }),
        error: error,
      });
    }
  },
  picUpdate: async (req, res) => {
    // Get the user's preferred language
    const lang = req.getLocale();
    try {
      const id = req.userData.id;
      //check user is exists or not
      await sails.helpers.checkUser(id);
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
          } else {
            if (uploadedFiles.length > 0) {
              const pictureFd = await uploadedFiles[0].fd;
              try {
                await User.updateOne({ id: id }, { profilePic: pictureFd });
                return res.status(200).json({
                  message: sails.__(`user.picUpdate`, { lang }),
                });
              } catch (error) {
                return res.status(500).json({
                  message: sails.__("user.notUpdatePic", { lang: lang }),
                  error: error,
                });
              }
            } else {
              return res.status(404).json({
                message: {
                  message: sails.__(`post.imageNotFound`, { lang }),
                },
              });
            }
          }
        }
      );
    } catch (error) {
      return res.status(500).json({
        message: sails.__("user.notUpdatePic", { lang: lang }),
        error: error,
      });
    }
  },
  followers: async (req, res) => {
    // Get the user's preferred language
    const lang = req.getLocale();
    try {
      const userId = await req.userData.id;
      //check user is exists or not
      await sails.helpers.checkUser(userId);
      //find user
      const user = await User.findOne({ id: userId });
      res.status(200).json({
        count: Object.values(user.followers).length,
        followers: Object.values(user.followers),
      });
    } catch (error) {
      return res.status(500).json({
        message: sails.__("user.notViewFollowers", { lang: lang }),
        error: error,
      });
    }
  },
  following: async (req, res) => {
    // Get the user's preferred language
    const lang = req.getLocale();
    try {
      const userId = await req.userData.id;
      //check user is exists or not
      await sails.helpers.checkUser(userId);
      //find user
      const user = await User.findOne({ id: userId });
      res.status(200).json({
        count: Object.values(user.following).length,
        following: Object.values(user.following),
      });
    } catch (error) {
      return res.status(500).json({
        message: sails.__("user.notViewFollowing", { lang: lang }),
        error: error,
      });
    }
  },
  follow: async (req, res) => {
    // Get the user's preferred language
    const lang = req.getLocale();
    try {
      const followerUserId = await req.userData.id;
      const followedUserId = await req.body.id;

      //check user is exists or not
      await sails.helpers.checkUser(followerUserId);
      //check user is exists or not
      await sails.helpers.checkUser(followedUserId);

      // find the followedUser using followerUserId
      const followedUser = await User.findOne({ id: followerUserId });
      // find the followerUser using followedUserId
      const followerUser = await User.findOne({ id: followedUserId });
      // console.log(followedUser);

      //follow and unFollow logic
      if (followedUser.following[followedUserId] === followerUser.userName) {
        delete followedUser.following[followedUserId];
      } else {
        // add followerUser data in followedUser
        followedUser.following[followedUserId] = followerUser.userName;
      }
      //set the followedUser
      await User.updateOne({ id: followerUserId }).set(followedUser);
      //follow and unFollow logic
      if (followerUser.followers[followerUserId] === followedUser.userName) {
        // console.log(2);
        delete followerUser.followers[followerUserId];
      } else {
        // add followerUser data in followedUser
        followerUser.followers[followerUserId] = followedUser.userName;
      }
      //set the followerUser
      await User.updateOne({ id: followedUserId }).set(followerUser);
      return res.status(200).json({
        user: {
          message: sails.__("user.follow/unFollow", { lang: lang })
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: sails.__("user.notFollow", { lang: lang }),
        error: error,
      });
    }
  },
};
