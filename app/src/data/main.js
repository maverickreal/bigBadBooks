const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`;

let client = new MongoClient(
  uri,
  { useNewUrlParser: true }
  ), db = null;

const init = async () => {
  try {
    await client.connect();
    db = client.db(process.env.DBNAME);
    const toFlush = ( process.env.FLUSHDB==='true' );
    if(toFlush){
      await truncate();
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyCredentials = async (email, password) => {
  let returnValue = false;
  try {
    const users = db.collection('users');
    const user = await users.findOne({ $or: [ {email}, {password} ] });
    if (user) {
      returnValue = true;
    }
  } catch (error) {
    console.log(error);
  }
  return returnValue;
};

const userExists = async (email, password) => {
  let returnValue={};
  try {
    const users = db.collection('users');
    const user = await users.findOne(
      { email, password },
      {projection: { name: 1, email: 1, userId: 1}});
    if (user) {
      delete user._id;
      returnValue = { user };
    } else {
      returnValue = { error: 'user could not be found' };
    }
  } catch (error) {
    returnValue = { error };
  }
  return returnValue;
};

const createUser = async (userId, name, email, password) => {
  let returnValue = {};
  try {
    const users = db.collection('users');
    await users.insertOne({ userId, name, email, password, books: [] });
    returnValue.user = { name, email, userId };
  } catch (error) {
    returnValue = { error };
  }
  return returnValue;
};

const getUserProfile = async userId => {
  let returnValue = {};
  try {
    const users = db.collection('users');
    const res = await users.findOne({userId}, {projection:{bookCount:{$size:'$books'}, _id:0, name:1, email:1}});
    if(!res){
      returnValue = { error: 'user not found to exist' };
    }
    else {
      returnValue.profile = res;
    }
  }
  catch (error) {
    console.log(error);
    returnValue = { error };
  }
  return returnValue;
}

const createBook = async (bookId, userId, title, genre) => {
  let returnValue = {};
  try {
    const books = db.collection('books'), users = db.collection('users');
    await books.insertOne({
          bookId, title, genre, userId,
          createdAt: new Date()
    });
    await users.updateOne({ userId }, { $push: { books: bookId } });
    returnValue.book = { bookId, title, genre };
  }
  catch (error) {
    returnValue = { error };
  }
  return returnValue;
};

const deleteBook = async (userId, bookId) => {
  try {
    const books  = db.collection('books'), users=db.collection('users');
    const res = await books.findOne({ bookId, userId });
    if (!res) {
      return false;
    }
    await books.deleteOne({ bookId });
    await users.updateOne(
      { userId },
      { $pull: { books: bookId } }
    );
  }
  catch (error) {
    return false;
  }
  return true;
}

const updateBook = async ( userId, bookId, data ) => {
  try{
    const books = db.collection('books');
    if(!data.title){
      delete data.title;
    }
    if(!data.desc){
      delete data.desc;
    }
    const res = await books.updateOne({ bookId, userId }, {$set: data});
    if(res.matchedCount!==1){
      return { error:'book not found' };
    }
    else{
      return { bookId, ...data };
    }
  }
  catch(error){
    return { error };
  }
}

const getBook = async bookId => {
  let returnValue = {};
  try {
    const books = db.collection('books');
    const book = await books.findOne({ bookId }, {projection: {userId: 0}});
    if (!book) {
      returnValue = { error: 'book not found' };
    }
    else {
      delete book._id;
      returnValue = { book };
    }
  }
  catch (error) {
    returnValue = { error };
  }
  return returnValue;
}

const getBooksOfUser = async userId => {
  let returnValue = {};
  try {
    const users = db.collection('users'), books = db.collection('books');
    const user = await users.findOne({ userId });
    if (!user) {
      returnValue = { error: 'user could not be found' };
    }
    else {
      const booksList = books.find({ userId }, { projection:
        { title: 1,
        genre: 1,
        bookId: 1,
        createdAt: 1 }
      });
      returnValue = { books: [] };
      for await ( const book of booksList){
        delete book._id;
        returnValue.books.push(book);
      }
    }
  }
  catch (error) {
    console.log(error);
    returnValue = { error };
  }
  return returnValue;
}

const truncate = async () => {
  try{
    await db.collection('users').drop();
    await db.collection('books').drop();
  }
  catch(error){
    console.log(error);
  }
}

module.exports={ init, verifyCredentials, userExists,
                 createBook, createUser, deleteBook,
                 getBook, getBooksOfUser, getUserProfile,
                 updateBook
               };