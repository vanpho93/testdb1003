const { verify } = require('../helpers/jwt');

function mustBeUser(req, res, next) {
    verify(req.headers.token)
    .then(obj => {
        req.idUser = obj._id;
        next();
    })
    .catch(error => res.status(400).send({ success: false, message: 'invalid token' }))
}

module.exports = { mustBeUser };
