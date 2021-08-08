const { app } = require('../index');
const supertest = require('supertest');
const api = supertest(app);
const User = require('../models/User');

const initialUsers = [
    {
        username: 'juanca',
        name: 'juan carlos',
        password: 'qwer8765',
        events: []
    },
    {
        username: 'maju',
        name: 'maría julia',
        password: 'asdf6543',
        events: []
    },
    {
        username: 'majo',
        name: 'maría josé',
        password: 'zxcv4321',
        events: []
    }
]

const getTitlesFromEvents = async () => {    
    const res = await api.get('/api/events')
    return {
        titles: res.body.map(event => event.title),
        res
    }
}

const getUsers = async () => {
    const usersDBAfter = await User.find({});
    return usersDBAfter.map(user => user.toJSON());
}

const getToken = async () => {

    await api
        .post('/api/users')
        .set({'Content-Type': 'application/json'})
        .send({"username": "root", "name": "rut", "password": "rootroot"})
                    
    let token = null;
        
    const response = await api
        .post('/api/login')
        .set({'Content-Type': 'application/json'})
        .send({"username": "root", "password": "rootroot"})
    return `bearer ${response.body.token}`;
}

module.exports = {
    initialUsers,
    api,
    getTitlesFromEvents,
    getUsers,
    getToken
}