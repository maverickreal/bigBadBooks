require('dotenv').config();
require('./data/main.js').init(); // Initialize the data tier

const express = require('express'),
      helmet = require('helmet'),
      morgan = require('morgan'),
      cors = require('cors'),
      { auth } = require('./middleware/auth.js'),
      router = require('./routes/main.js');
      
const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());

app.post('/signup', router.signUp);

app.post('/signin', router.signIn);

app.post('/signout', auth, router.signOut);

app.get('/user', auth, router.getUser);

app.post('/book', auth, router.createBook);

app.delete('/book/:bookId', auth, router.deleteBook);

app.put('/book/:bookId', auth, router.updateBook);

app.get('/book/:bookId', auth, router.getBook);

app.get('/books', auth, router.getUserBooks);

// app.listen(process.env.PORT, ()=>console.log('Started app server.'));

module.exports = app;