/* eslint-disable indent */
module.exports = async (req, res, next) => {
    try {
        const token = await req.headers.authorization.split(' ')[1];
        const decodedToken = await sails.helpers.verifyToken.with({
            token: token,
        });
        req.userData = decodedToken;
        return next();

    } catch (error) {
        // console.log(error);
        return res.status(401).json({ error: 'Authentication failed' });
    }

};