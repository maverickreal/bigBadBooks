const { verify, sign } = require('jsonwebtoken');

let uidToJwt = {};

const assignToken = user => {
    const jwtToken = sign(user,
        process.env.JWTSECRETKEY,
        { expiresIn: '7d' }
        );
    user.token = jwtToken;
    uidToJwt[user.userId] = jwtToken;
}

const invalidate = userId => {
    delete uidToJwt[userId];
}

const auth = (userId, jwtToken) => {
    try {
        const user = verify(jwtToken, process.env.JWTSECRETKEY),
              realToken = uidToJwt[userId];
        return ( realToken === jwtToken ? user : null );
    }
    catch (error) {
        console.log('auth error', error);
        return null;
    }
};


module.exports = {
    assignToken, auth, invalidate
};