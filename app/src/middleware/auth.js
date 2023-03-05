const superagent = require('superagent');

const url = `http://${process.env.AUTHHOST}:${process.env.AUTHPORT}`,
      emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const assignToken = async user => {
    try{
        const res = await superagent.post(url+'/authorise').send({user});
        if(res.status!=200){
            return false;
        }
        user.token = res.body.token;
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

const invalidate = async userId => {
    try{
        const res = await superagent.put(url+'/unauthorise').send({userId});
        return (res.status!=200);
    }
    catch(err){
        console.log(err);
        return false;
    }
}

const auth = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'],
              authRes = await superagent.get(url+'/verify').send({token});
        if(authRes.status!=200){
            res.status(401).send({ status: 'error', message: 'authentication failed' });
            return false;
        }
        req.user = authRes.body.user;
        next();
        return true;
    }
    catch (error) {
        console.log('auth error', error);
        res.status(401).send({ status: 'error', message: 'authentication failed' });
        return false;
    }
};

const checkEmail = email =>{
    return emailPattern.test(email);
}

const checkPassword = password => {
    if (password.length < 6) {
        return false;
    }
    let strength = 1;
    if (password.length >= 8){
        strength += 1;
    }
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)){
        strength += 2;
    }
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)){
        strength += 3;
    }
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)){
        strength += 3;
    }
    if (password.length > 12){
        strength += 1;
    }
    return ( strength>=3 );
}


module.exports = {
    assignToken, auth,
    checkEmail, checkPassword,
    invalidate
};