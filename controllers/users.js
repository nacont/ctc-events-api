const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/User');

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('events', {
        title: 1,
        description: 1,
        _id: 0
    });
    res.json(users);
});

usersRouter.post('/', async (req, res) => {
    try {        
        const { body } = req;
        const { username, name, password } = body;

        if(!username || username === '') {
            res.status(400).json(error)
        }

        if(!name || name === '') {
            res.status(400).json(error)
        }

        if(!password || password === '') {
            res.status(400).json(error)
        }
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds);
    
        const user = new User({
            username,
            name,
            passwordHash
        });
    
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = usersRouter;
