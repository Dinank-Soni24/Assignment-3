/* eslint-disable indent */
/**
 * PostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  postAdd: async (req, res) => {
    // Get the user's preferred language
    const lang = req.getLocale();
    try {
      const { title, content, createdBy } = req.body;
      //check user is exists or not
      await sails.helpers.checkUser(createdBy);
      // Upload the image
      req.file("image").upload(
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
            let imageFd = "";
            if (uploadedFiles.length > 0) {
              //     console.log(uploadedFiles);
              imageFd = await uploadedFiles[0].fd;
            }
            try {
              const newPost = await Post.create({
                title,
                content,
                image: imageFd,
                createdBy,
                like: {},
                comment: {},
              }).fetch();
              return res.json({
                message: sails.__(`post.created`, { lang }),
                user: newPost,
              });
            } catch (error) {
              return res.status(500).json({
                message: sails.__("post.notCreate", { lang: lang }),
                error: error,
              });
            }
            // }
            // else {
            //     return res.status(500).json({
            //         message: {
            //             message: sails.__(`post.imagenotfound`, { lang })
            //         }
            //     });
            // }
          }
        }
      );
    } catch (error) {
      return res.status(500).json({
        message: sails.__("post.notCreate", { lang: lang }),
        error: error,
      });
    }
  },
  like: async (req, res) => {
    // Get the user's preferred language
    const lang = req.getLocale();
    try {
      const userId = await req.params.id;
      const postId = await req.body.id;
      //check user is exists or not
      console.log(1);
      await sails.helpers.checkUser(userId);
      //check post is exists or not
      console.log(2);
      await sails.helpers.checkPost(postId);
      console.log(3);
      //find post
      const post = await Post.findOne({ id: postId });
      //find user
      const user = await User.findOne({ id: userId });
      //like or dislike post logic
      if (post.like[userId] === user.userName) {
        delete post.like[userId];
      } else {
        post.like[userId] = user.userName;
      }
      //set the post
      await Post.updateOne({ id: postId }).set(post);
      return res.status(200).json({
        post: {
          message: sails.__("post.Liked", { lang: lang }),
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: sails.__("post.notLiked", { lang: lang }),
        error: error,
      });
    }
  },
  comment: async (req, res) => {
    // Get the user's preferred language
    const lang = req.getLocale();
    try {
      const userId = await req.params.id;
      const postId = await req.body.id;
      const comments = await req.body.comment;
      //check user is exists or not
      await sails.helpers.checkUser(userId);
      //check post is exists or not
      await sails.helpers.checkPost(postId);
      //find post
      const post = await Post.findOne({ id: postId });
      //find user
      const user = await User.findOne({ id: userId });
      // const keys = Object.keys(post.comment);
      const newComment = await Comment.create({
        text: `@${user.userName}  ${comments}`,
        onPost: postId,
      }).fetch();
      return res.status(200).json({
        post: {
          message: sails.__("post.comment", { lang: lang }),
          comment: newComment,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: sails.__("post.notComment", { lang: lang }),
        error: error,
      });
    }
  },
  getPost: async (req, res) => {
    // Get the user's preferred language
    const lang = req.getLocale();
    try {
      const limit = req.query.limit || 2;
      const skip = req.query.skip || 0;
      const post = await Post.find({
        sort: "publishedDate DESC",
        limit: limit,
        skip: skip,
      });
      res.status(200).json({
        message: sails.__("post.Found", { lang: lang }),
        count: post.length,
        Posts: post,
      });
    } catch (error) {
      return res.status(404).json({
        message: sails.__("post.notFound", { lang: lang }),
        error: error,
      });
    }
  },
};
