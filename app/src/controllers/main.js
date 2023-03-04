const router = require('express').Router(),
	  handler = require('../handlers/main.js'),
	  { auth } = require('../middleware/auth.js');

router.post('/signup', handler.signUp);

router.post('/signin', handler.signIn);

router.post('/signout', auth, handler.signOut);

router.get('/user', auth, handler.getUser);

router.post('/book', auth, handler.createBook);

router.delete('/book/:bookId', auth, handler.deleteBook);

router.put('/book/:bookId', auth, handler.updateBook);

router.get('/book/:bookId', auth, handler.getBook);

router.get('/books', auth, handler.getUserBooks);

module.exports = router;