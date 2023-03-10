/* eslint-disable indent */
/**
 * ProfileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    profile: async (req, res) => {

        try {

            // Get the user's preferred language
            const lang = req.getLocale();

            const _id = await req.body.id;
            const user = await User.findOne({ _id });

            return res.json({
                message: sails.__(`user.found`, { lang }),
                user: {
                    userName: user.userName,
                    email: user.email,
                    profilePic: user.profilePic,
                    roles: user.roles,
                    followers: user.followers,
                    following: user.following
                }
            });

        } catch (error) {
            return res.status(500).json({
                error: error,
            });
        }

    },

    passwordUpdate: async (req, res) => {

        try {
            const id = req.params.id;
            const password = req.body.password;

            const user = await User.findOne({ id: id });

            await User.updateOne({ id: id }, { password: password });

            return res.json({
                user: {
                    message: 'password update successfully'
                }
            });

        } catch (error) {
            return res.status(500).json({ error: error + "hello" });
        }
    },

    picUpdate: async (req, res) => {

        try {

            // Get the user's preferred language
            const lang = req.getLocale();
            const id = req.params.id;

            req.file('profilePic').upload({
                maxBytes: 10000000
            }, async (err, uploadedFiles) => {
                if (err) {
                    return res.serverError(err);
                } else {
                    if (uploadedFiles.length > 0) {
                        const pictureFd = await uploadedFiles[0].fd;

                        try {
                            await User.updateOne({ id: id }, { profilePic: pictureFd });

                            return res.json({
                                message: sails.__(`user.picUpdate`, { lang }),
                            });
                        } catch (error) {
                            return res.json({
                                error: error + "hello"
                            })
                        }
                    } else {
                        return res.status(500).json({
                            message: {
                                message: sails.__(`post.imagenotfound`, { lang })
                            }
                        });
                    }
                }
            })

        } catch (error) {
            return res.status(500).json({ error: error });
        }
    },

    followers: async (req, res) => {

        try {
            
            const userId = await req.params.id;

            //find user
            const user = await User.findOne({ id: userId });

            res.status(200).json({
                count: user.followers.length,
                followers: Object.values(user.followers)
            });

        } catch (error) {
            return res.status(500).json({ error: error + 'hello'});
        }
    },

    following: async (req, res) => {

        try {
            
            const userId = await req.params.id;

            //find user
            const user = await User.findOne({ id: userId });

            res.status(200).json({
                count: user.following.length,
                following: Object.values(user.following)
            });

        } catch (error) {
            return res.status(500).json({ error: error + 'hello'});
        }
    },

    follow: async (req, res) => {

        try {

            const followedUserId = await req.params.id;
            const followerUserId = await req.body.id;

            // find the followedUser using followedUserId
            const followedUser = await User.findOne({ id: followedUserId });

            // find the followerUser using followerUserId
            const followerUser = await User.findOne({ id: followerUserId });
            // console.log(followedUser);

            //follow and unFollow logic
            if (followedUser.following[followerUserId] === followerUser.userName) {
                delete followedUser.following[followerUserId]
            } else {
                // add followerUser data in followedUser 
                followedUser.following[followerUserId] = followerUser.userName
            }

            //set the followedUser
            await User.updateOne({ id: followedUserId }).set(followedUser);

            //follow and unFollow logic
            if (followerUser.followers[followedUserId] === followedUser.userName) {
                // console.log(2);
                delete followerUser.followers[followedUserId]
            } else {
                // add followerUser data in followedUser 
                followerUser.followers[followedUserId] = followedUser.userName
            }

            //set the followerUser
            await User.updateOne({ id: followerUserId }).set(followerUser);

            return res.json({
                user: {
                    message: 'follow/unFollow successfully'
                }
            });
        } catch (error) {
            return res.status(500).json({ error: error + "hello" });
        }
    }

};

