const app = require('../../src/server.js'),
      st = require('supertest'),
      req = st(app);

jest.setTimeout(1);

describe('running tests', () => {

    test('testing signup', async () => {
        const res = await req.post('/signup').send({
            email: 'abc@xyz.org', firstName: 'fname',
            lastName: 'lname', password: 'password'
        });
        console.log(1, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('repeating  signup', async () => {
        const res = await req.post('/signup').send({
            email: 'abc@xyz.org', firstName: 'fname',
            lastName: 'lname', password: '#Mypassword9'
        });
        console.log(2, res.body.message);
        expect(res.statusCode).toBe(200);
    });

    test('repeating  signup', async () => {
        const res = await req.post('/signup').send({
            email: 'abc@xyz.org', firstName: 'fname',
            lastName: 'lname', password: '&Yourpassword8'
        });
        console.log(3, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    let token='';

    test('testing signing in', async () => {
        const res = await req.post('/signin').send({
            email: 'abc@xyz.org', password: '#Mypassword9'
        });
        console.log(4, res.body.message);
        expect(res.statusCode).toBe(200);
        token = res.body.message.token;
    });

    test('repeating sign-in test', async () => {
        const res = await req.post('/signin').send({
            email: 'abcd@xyz.org', password: '#Mypassword9'
        });
        console.log(5, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    let bookId='';

    test('inserting 2 books', async ()=>{
        await req.post('/book').send({
            title:'title', genre:'genre', token
        });
        const res = await req.post('/book').send({
            title:'title', genre:'genre', token
        });
        console.log(6, res.body.message);
        bookId = res.body.message.bookId;
        expect(res.statusCode).toBe(200);
    });

    test('repeating book creation', async ()=>{
        const res = await req.post('/book').send({
            title:'title', genre:'genre', token:'avb'
        });
        console.log(7, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('testing book fetching', async ()=>{
        const res = await req.get(`/book/`).send({ token });
        console.log(8, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('fetching all books', async ()=>{
        const res = await req.get(`/books`).send({ token });
        console.log(9, res.body.message);
        expect(res.statusCode).toBe(200);
        expect(res.body.message.length).toBe(2);
    });

    test('deleting the last book', async ()=>{
        const res = await req.delete(`/book/${bookId}`).send({ token });
        bookId = '';
        console.log(10, res.body.message);
        expect(res.statusCode).toBe(200);
    });

    test('repeating book deletion', async ()=>{
        const res = await req.delete(`/book/sudhf`).send({ token });
        console.log(11, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('repeating book fetching', async ()=>{
        const res = await req.get(`/book/${bookId}`).send({ token });
        console.log(12, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('repeating all books fetching', async ()=>{
        const res = await req.get(`/books`).send({ token });
        console.log(13, res.body.message);
        expect(res.statusCode).toBe(200);
        expect(res.body.message.length).toBe(1);
        bookId=res.body.message[0].bookId;
    });

    test('testing book updation', async ()=>{
        const res = await req.put(`/book/${bookId}`).send({
            token,
            title:'alphaTitle',
            genre:'alphaDesc'
        });
        console.log(14, res.body.message);
        expect(res.statusCode).toBe(200);
    });

    test('repeating book updation', async ()=>{
        const res = await req.put(`/book/${bookId}`).send({ token });
        console.log(15, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('logging out', async () => {
        const res = await req.post('/signout').send({ token });
        console.log(16, res.body.message);
        expect(res.statusCode).toBe(200);
    });

    test('inserting book', async ()=>{
        const res = await req.post('/book').send({
            title:'title', genre:'genre', token
        });
        console.log(17, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('testing book fetching', async ()=>{
        const res = await req.get(`/book/`).send({ token });
        console.log(18, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('fetching all books', async ()=>{
        const res = await req.get(`/books`).send({ token });
        console.log(19, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('deleting the last book', async ()=>{
        const res = await req.delete(`/book/${bookId}`).send({ token });
        console.log(20, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });

    test('testing book updation', async ()=>{
        const res = await req.put(`/book/${bookId}`).send({
            token,
            title:'alphaTitle',
            genre:'alphaDesc'
        });
        console.log(21, res.body.message);
        expect(res.statusCode).not.toBe(200);
    });
});