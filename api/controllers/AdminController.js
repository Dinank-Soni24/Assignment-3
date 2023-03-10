/* eslint-disable indent */
/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

    getUser: async (req, res) => {

        try {

            const limit = req.query.limit || 2;
            const skip = req.query.skip || 0;

            const user = await User.find({ where: { roles: 'u' }, limit: limit, skip: skip });

            res.status(200).json({
                count: user.length,
                users: user
            });

        } catch (error) {
            return res.status(500).json({ error: error });
        }
    },

    status: async (req, res) => {
        try {
            const userId = await req.params.id;
            const status = await req.body.status;

            //find user
            const user = await User.findOne({ id: userId });

            await User.updateOne({id: userId}, {status: status});

            return res.json({
                post: {
                    message: 'status update successfully'
                }
            });

        } catch (error) {
            return res.status(500).json({ error: error });
        }
    },

    userPost: async (req, res) => {
        try {
            const userId = await req.params.id;

            const post = await Post.find({where: {createdBy: userId}, sort: 'publishedDate DESC'});

            return res.json({
                post: {
                    count: post.length,
                    post: post
                }
            });

        } catch (error) {
            return res.status(500).json({ error: error });
        }
    }

};

