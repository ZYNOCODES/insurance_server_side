const JWT = require('jsonwebtoken');

//jwt secret
const createToken = (id, role, region) => {
    return JWT.sign({id: id, role: role, region: region}, process.env.SECRET_KEY, {expiresIn: '1d'});
}

module.exports = {
    createToken
};