/* eslint-disable eol-last */
/* eslint-disable indent */
/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require('bcrypt');

module.exports = {

    signUp: async (req, res) => {

        try {
            // Get the user's preferred language
            const lang = req.getLocale();

            const { userName, email, password, } = req.body;

            // Upload the profilePic image
            req.file('profilePic').upload({
                maxBytes: 10000000
            }, async (err, uploadedFiles) => {
                if (err) {
                    return res.serverError(err);
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
                            profilePic: avatarFd
                        }).fetch();
                        return res.json({
                            message: sails.__(`user.created`, { lang }),
                            user: newUser
                        });
                    } catch (error) {
                        return res.status(500).json({
                            error: error,
                            message: {
                                message: sails.__(`user.exists`, { lang })
                            }
                        });
                    }
                } else {
                    return res.status(500).json({
                        message: {
                            message: sails.__(`user.imagenotfound`, { lang })
                        }
                    });
                }
            });
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    },

    login: async (req, res) => {
        try {
            // Get the user's preferred language
            const lang = req.getLocale();

            // get data from body
            const { email, password, } = req.body;

            const user = await User.findOne({ email })
            console.log(user);
            if (!user) {
                return res.status(500).json({
                    message: {
                        message: sails.__(`user.notfound`, { lang })
                    }
                });
            } else {
                //check the password
                const checkPassword = await bcrypt.compare(req.body.password, user.password);

                if (checkPassword === true)
                {
                    try {
                        const token = await sails.helpers.generateToken(email, password, "3m")
                        console.log(token);
                        const userUpdate = await User.updateOne({ email }, { token: token })
    
                    } catch (error) {
                        return "error"
                    }
                    return res.status(200).json({
                        message: sails.__(
                            'user.found',
                            { lang: lang }
                        )
                    })
                }

            }


        } catch (error) {

        }
    }
};