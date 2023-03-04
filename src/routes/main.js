const db = require('../data/main.js'), { v4: uuid } = require('uuid'),
{checkEmail, checkPassword, assignToken, invalidate } = require('../middleware/auth.js');

const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!(firstName && lastName && email && password)) {
            return res.status(400).send({
                status: 'error',
                message: 'signup information not provided'
            });
        }
        if(!checkPassword(password)){
            return res.status(400).send({
                status: 'error',
                message: 'weak password'
            });
        }
        if (!checkEmail(email)) {
            return res.status(400).send({
                status: 'error',
                message: 'invalid email address'
            });
        }
        if ((await db.verifyCredentials(email, password)) === true) {
            return res.status(400).send({
                status: 'error',
                message: 'credentials already in use'
            });
        }
        const userId = uuid();
        const { error, user } = await db.createUser(
            userId, firstName + ' ' + lastName,
            email, password
            );
        if (error) {
            res.status(500).send({
                status: 'error', message: error
            });
        }
        else{
            assignToken(user);
            delete user.userId;
            res.status(200).send({
                status: 'ok',
                message: user
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error' });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({
                status: 'error',
                message: 'login information not provided'
            });
        }
        const { error, user } = await db.userExists(email, password);
        if (error) {
            return res.status(500).send({
                status: 'error',
                message: error
            });
        }
        assignToken(user);
        delete user.userId;
        res.status(200).send({
            status: 'ok',
            message: user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error' });
    }
};

const signOut = async (req, res)=>{
    invalidate(req.user.userId);
    res.status(200).send({
        status:'ok'
    });
}

const getUser = async (req, res) => {
    try {
        const { error, profile } = await db.getUserProfile(req.user.userId);
        if(error){
            res.status(400).send({
                status: 'error',
                message: 'user not found'
            });
        }
        else{
            res.status(200).send({
                status: 'ok',
                message: profile
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error' });
    }
};

const createBook= async (req, res) => {
    try {
        if (!req.body.title || !req.body.genre) {
            return res.status(400).send({
                status: 'error',
                message: 'book description missing'
            });
        }
        let { book, error } = await db.createBook(uuid(), req.user.userId, req.body.title, req.body.genre);
        if (error) {
            res.status(500).send({
                status: 'error',
                message: error
            });
        }
        else {
            res.status(200).send({
                status: 'ok',
                message: book
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error' });
    }
};

const deleteBook = async (req, res) => {
    try {
        let done = await db.deleteBook(req.user.userId, req.params['bookId']);
        if (!done) {
            res.status(500).send({ status: 'error' });
        }
        else {
            res.status(200).send({ status: 'ok' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error' });
    }
};

const updateBook = async (req, res) => {
    try{
        const data = {
            title: req.body.title,
            genre: req.body.genre
        };
        if (!data.title && !data.genre) {
            return res.status(400).send({
                status: 'error',
                message: 'no update provided'
            });
        }
        let {error, book} = await db.updateBook(req.user.userId, req.params['bookId'], data);
        if(error){
            res.status(404).send({
                status: 'error',
                message: error
            });
        }
        else{
            res.status(200).send({
                status: 'ok',
                message: book
            });
        }
    }
    catch(error){
        console.log(error);
        res.status(500).send({status: 'error'});
    }
}

const getBook = async (req, res) => {
    try {
        let { error, book } = await db.getBook(req.params['bookId']);
        if (error) {
            res.status(500).send({
                status: 'error',
                message: error
            });
        }
        else {
            res.status(200).send({
                status: 'ok',
                message: book
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error' });
    }
};

const getUserBooks = async (req, res) => {
    try {
        let { error, books } = await db.getBooksOfUser(req.user.userId);
        if (error) {
            res.status(500).send({
                status: 'error',
                message: error
            });
        }
        else {
            res.status(200).send({
                status: 'ok',
                message: books
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error' });
    }
};

module.exports = { signIn, signUp, getUser,
                   createBook, deleteBook, getBook,
                   getUserBooks, updateBook, signOut };