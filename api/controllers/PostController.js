/* eslint-disable indent */
/**
 * PostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    postAdd: async (req, res) => {
        try {
            // Get the user's preferred language
            const lang = req.getLocale();

            const { title, content, createdBy } = req.body;


            // Upload the image
            req.file('image').upload({
                maxBytes: 10000000
            }, async (err, uploadedFiles) => {
                if (err) {
                    return res.serverError(err);
                }
                else {
                    if (uploadedFiles.length > 0) {
                        const imageFd = await uploadedFiles[0].fd;

                        try {
                            const newPost = await Post.create({
                                title,
                                content,
                                image: imageFd,
                                createdBy,
                                like: {},
                                comment: {}
                            }).fetch();
                            return res.json({
                                message: sails.__(`post.created`, { lang }),
                                user: newPost
                            });
                        } catch (error) {
                            return res.json({
                                error: error + "hello"
                            })
                        }
                    }
                    else {
                        return res.status(500).json({
                            message: {
                                message: sails.__(`post.imagenotfound`, { lang })
                            }
                        });
                    }
                }
            })

        } catch (error) {
            return res.json({
                error: error + "hello"
            })
        }
    },

    like: async (req, res) => {

        try {

            const userId = await req.params.id;
            const postId = await req.body.id;

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

            return res.json({
                post: {
                    message: 'like/unlike successfully'
                }
            });

        } catch (error) {
            return res.status(500).json({ error: error + "hello" });
        }
    },

    comment: async (req, res) => {

        try {

            const userId = await req.params.id;
            const postId = await req.body.id;
            const comments = await req.body.comment;

            //find post
            const post = await Post.findOne({ id: postId });

            //find user
            const user = await User.findOne({ id: userId });
            // const keys = Object.keys(post.comment);


            post.comment[userId] = `@${user.userName} comment on your post:-  ${comments}`

            //set the post
            await Post.updateOne({ id: postId }).set(post);

            return res.json({
                post: {
                    message: 'comment successfully'
                }
            });

        } catch (error) {
            return res.status(500).json({ error: error + "hello" });
        }
    }
};

