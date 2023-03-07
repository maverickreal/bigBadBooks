const router = require('express').Router(),
	  handler = require('../handlers/main.js'),
	  { auth } = require('../middleware/auth.js'),
	  {ipRateLimit, userRateLimit} = require('../middleware/rateLimit.js');

router.post('/signup', ipRateLimit, handler.signUp);

router.post('/signin', ipRateLimit, handler.signIn);

router.post('/signout', auth, handler.signOut);

router.get('/user', auth, userRateLimit, handler.getUser);

router.post('/book', auth, userRateLimit, handler.createBook);

router.delete('/book/:bookId', auth, userRateLimit, handler.deleteBook);

router.put('/book/:bookId', auth, userRateLimit, handler.updateBook);

router.get('/book/:bookId', auth, userRateLimit, handler.getBook);

router.get('/books', auth, userRateLimit, handler.getUserBooks);

module.exports = router;