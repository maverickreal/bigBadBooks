const express = require('express'),
      app = express(),
      helmet = require('helmet'),
      morgan = require('morgan'),
      cors = require('cors'),
      { auth } = require('./middleware/auth.js'),
      router = require('./routes/main.js'),
      db = require('./data/main.js');

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());

db.init(); // Initialize the data tier

app.post('/signup', router.signUp);

app.post('/signin', router.signIn);

app.post('/signout', auth, router.signOut);

app.get('/user', auth, router.getUser);

app.post('/book', auth, router.createBook);

app.delete('/book/:bookId', auth, router.deleteBook);

app.put('/book/:bookId', auth, router.updateBook);

app.get('/book/:bookId', auth, router.getBook);

app.get('/books', auth, router.getUserBooks);

if (process.env.ENV === 'test') {
    module.exports = app;
}
else {
    app.listen(process.env.PORT || 3000);
}