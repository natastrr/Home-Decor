const jwt = require("jsonwebtoken");
const config = require('../config/config');
const UserModel = require('../models/user.model');

class TokenUtils {
    static async generateTokens(user, rememberMe) {
        try {
            const payload = {id: user.id, email: user.email};

            const accessToken = jwt.sign(
                payload,
                config.secret,
                {expiresIn: rememberMe ? "2h" : "10d"}
            );
            const refreshToken = jwt.sign(
                payload,
                config.secret,
                {expiresIn: "30d"}
            );

            return Promise.resolve({accessToken, refreshToken});
        } catch (err) {
            return Promise.reject(err);
        }
    }

    static verifyRefreshToken(refreshToken) {
        return new Promise(async (resolve, reject) => {
            const user = await UserModel.findOne({refreshToken: refreshToken});
            if (!user) {
                return reject({error: true, message: "Токен не валиден"});
            }

            jwt.verify(refreshToken, config.secret, (err, tokenDetails) => {
                if (err)
                    return reject({error: true, message: "Токен не валиден"});
                resolve({
                    tokenDetails,
                    error: false,
                    message: "Valid refresh token",
                });
            });
        });
    }
}

module.exports = TokenUtils;