const express = require('express');
const massive = require('massive');
const users = require('../controllers/user.js')
massive({
    host: 'localhost',
    port: 5432,
    database: 'node3',
    user: 'postgres',
    password: 'node3db'
}).then(db => {
    const app = express();
    app.set('db', db);
    app.use(express.json());
    app.post('/api/users', users.create);
    app.get('/api/users', users.list);
    app.get('/api/users/:id', users.getById);
    app.get('/api/users/:id/profile', users.getProfile);
    app.post('/api/posts', users.createPosts);
    app.get('/api/posts/:id', users.getPostById);
    app.get('/api/user/:id/posts', users.getPostByUser);
    app.post('/api/comments', users.createComments);
    app.patch('/api/posts/:id',  users.updatePosts);
    app.patch('/api/comments/:userId/:id',  users.updateComments);
    const PORT = 3001;
    app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
    })
})
