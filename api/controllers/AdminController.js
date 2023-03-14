/* eslint-disable indent */
/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getUser: async (req, res) => {
    // Get the user's preferred language
    const lang = req.getLocale();
    try {
      const limit = req.query.limit || 2;
      const skip = req.query.skip || 0;
      const user = await User.find({
        where: { roles: "u" },
        limit: limit,
        skip: skip,
        select: ['userName','email','roles','profilePic','followers','following','status']
      });
      console.log(user);
      res.status(200).json({
        message: sails.__("user.Found", { lang: lang }),
        count: user.length,
        users: user,
      });
    } catch (error) {
      return res.status(404).json({
        message: sails.__("user.NotFound", { lang: lang }),
        error: error+'h',
      });
    }
  },
  status: async (req, res) => {
    // Get the user's preferred language
    const lang = req.getLocale();
    try {
      const userId = await req.body.id;
      const status = await req.body.status;
      //check user is exists or not        
      await sails.helpers.checkUser(userId);
      // //find user            
      // const user = await User.findOne({ id: userId });
      await User.updateOne({ id: userId }, { status: status });
      return res.status(200).json({
        post: { message: sails.__("user.statusUpdate", { lang: lang }) },
      });
    } catch (error) {
      return res.status(500).json({
        message: sails.__("user.statusNotUpdate", { lang: lang }),
        error: error,
      });
    }
  },
  userPost: async (req, res) => {
    // Get the user's preferred language
    const lang = req.getLocale();
    try {
      const userId = await req.body.id;
      //check user is exists or not            
      await sails.helpers.checkUser(userId);
      const post = await Post.find({
        where: { createdBy: userId },
        sort: "publishedDate DESC",
      }).populate('like',{likes: true})
      .populate('comments');
      return res.status(200).json({
        post: {
          message: sails.__("user.postsFound", { lang: lang }),
          count: post.length,
          post: post,
        },
      });
    } catch (error) {
      return res.status(404).json({
        message: sails.__("user.postNotFound", { lang: lang }),
        error: error,
      });
    }
  },
};
