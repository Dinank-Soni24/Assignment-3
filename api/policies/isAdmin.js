/* eslint-disable indent */
const { Roles } = sails.config.constant;
module.exports = async (req, res, next) => {
    try {
        // const token = await req.headers.authorization.split(' ')[1];
        // const decodedToken = await sails.helpers.verifyToken.with({
        //     token: token,
        // });
        decodedToken = req.userData;
        const user = await User.findOne({ email: decodedToken.email });
        if (user.roles === Roles.Admin) {
            return next()
        }else {
            return res.status(401).json({ error: 'Authentication failed' });
        }

    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
};