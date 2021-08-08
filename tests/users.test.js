const mongoose = require('mongoose');
const { server } = require('../index');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { api, initialUsers, getUsers } = require('./helpers');

describe('users tests', () => {
   
    beforeEach(async () => {
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash('pswd', 10);
        const user = new User({
            username: 'cambo',
            name: 'Camboya',
            passwordHash
        });        
        await user.save();

        // await User.deleteMany({});
        // for(const user of initialUsers) {
        //     const { password } = user;
        //     const passwordHash = await bcrypt.hash(password, 10);
        //     const userObject = new User({
        //         username: user.username,
        //         name: user.name,
        //         passwordHash: passwordHash,
        //         events: user.events
        //     });            
        //     await userObject.save();            
        // }
    });

    test('works as expected creating a fresh user', async () => {
        
        const usersAtStart = await getUsers();

        const newUser = {
            username: 'rompo',
            name: 'Romina',
            password: 'abc123'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
            
            const usersAtLast = await getUsers();

            expect(usersAtLast).toHaveLength(usersAtStart.length + 1);

            const usernames = usersAtLast.map(u => u.username);
            expect(usernames).toContain(newUser.username);
    });

    test('creation fails with proper statuscode and message if username is already taken', async () => {
        const usersAtStart = await getUsers();
        
        const newUser = {
            username: 'cambo',
            name: 'Camboya',
            password: 'abcd1234'
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        expect(result.body.errors.username.message).toContain('`username` to be unique');
        
        const usersAtEnd = await getUsers();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test('creation fails with proper statuscode if username is null', async () => {
        const usersAtStart = await getUsers();

        const newUser = {
            username: null,
            name: 'Asterix',
            password: 'abc123'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)            
            
            const usersAtLast = await getUsers();

            expect(usersAtLast).toHaveLength(usersAtStart.length);
    });

    test('creation fails with proper statuscode if username blank', async () => {
        const usersAtStart = await getUsers();

        const newUser = {
            username: '',
            name: 'Asterix',
            password: 'abc123'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)            
            
            const usersAtLast = await getUsers();

            expect(usersAtLast).toHaveLength(usersAtStart.length);
    });

    test('creation fails with proper statuscode if name is null', async () => {
        const usersAtStart = await getUsers();

        const newUser = {
            username: 'Asterix',
            name: null,
            password: 'abc123'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)            
            
            const usersAtLast = await getUsers();

            expect(usersAtLast).toHaveLength(usersAtStart.length);
    });

    test('creation fails with proper statuscode if name is blank', async () => {
        const usersAtStart = await getUsers();

        const newUser = {
            username: 'Asterix',
            name: '',
            password: 'abc123'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)            
            
            const usersAtLast = await getUsers();

            expect(usersAtLast).toHaveLength(usersAtStart.length);
    });

    test('creation fails with proper statuscode if password is null', async () => {
        const usersAtStart = await getUsers();

        const newUser = {
            username: 'Obelix',
            name: 'Asterix',
            password: null
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)            
            
            const usersAtLast = await getUsers();

            expect(usersAtLast).toHaveLength(usersAtStart.length);
    });

    test('creation fails with proper statuscode if password is blank', async () => {
        const usersAtStart = await getUsers();

        const newUser = {
            username: 'Obelix',
            name: 'Asterix',
            password: ''
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)            
            
            const usersAtLast = await getUsers();

            expect(usersAtLast).toHaveLength(usersAtStart.length);
    });

    afterAll( () => {
        mongoose.connection.close();
        mongoose.disconnect();
        server.close();
    });
});