const { verify, sign } = require('jsonwebtoken');

let uidToJwt = {},
    jsk = process.env.JWTSECRETKEY;

const assignToken = user => {
    const jwtToken = sign(user,
        jsk,
        { expiresIn: '7d' }
        );
    user.token = jwtToken;
    uidToJwt[user.userId] = jwtToken;
}

const invalidate = userId => {
    delete uidToJwt[userId];
}

const auth = jwtToken => {
    try {
        const user = verify(jwtToken, jsk),
              realToken = uidToJwt[user.userId];
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