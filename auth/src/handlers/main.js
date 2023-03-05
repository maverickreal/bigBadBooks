const { assignToken, invalidate, auth } = require('../middleware/auth.js');

const authorise = async (req, res)=>{
    try{
        const {user} = req.body;
        if(!user){
            return res.status(404).send({status:'error', message:'Correct user object not provided.'});
        }
        assignToken(user);
        res.status(200).send({
            status: 'ok', token: user.token
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({status:'error'});
    }
}

const unauthorise = async (req, res)=>{
    try{
        const {userId} = req.body;
        if(!userId){
            return res.status(404).send({status:'error', message:'Correct user not provided.'});
        }
        invalidate(userId);
        res.status(200).send({status:'ok'});
    }
    catch(error){
        console.log(error);
        res.status(500).send({status:'error'});
    }
}

const verify = (req, res)=>{
    try{
        const {token} = req.body,
              user = auth(token);
        if(user==null){
            res.status(404).send({status:'error', message:'Correct token not provided.'});
        }
        else{
            res.status(200).send({status:'ok', user});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).send({status:'error'});
    }
}

module.exports = { authorise, unauthorise, verify };