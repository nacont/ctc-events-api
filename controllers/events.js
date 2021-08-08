const eventsRouter = require('express').Router();
const Event = require('../models/Event');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const userExtractor = require('../middleware/userExtractor');

eventsRouter.get('/', async (req, res) => {
    // const events = await Event.find({}).populate('user').sort({datesArray: 'desc'});
    const events = await Event.find({}).populate('user').sort({datesArray: 'desc'});
    res.json(events);
});

eventsRouter.get('/highlight', async (req, res) => {
    // const events = await Event.find({}).populate('user').sort({datesArray: 'desc'});
    const events = await Event.find({highLight: true}).sort({datesArray: 'desc'});
    res.json(events);
});


eventsRouter.get('/find/:id', async (req, res, next) => {
    const { id } = req.params;
    
    Event.findById(id)
        .then(event => {
            if(event) return res.json(event)
            res.status(404).end()
        })
        .catch(error => next(error))
});

eventsRouter.get('/byuser', userExtractor, async (req, res, next) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const startIndex = ((page - 1) * limit);
    const endIndex = (page * limit);
    const results = {};
    
    const { userId } = req;
    const events = await Event.find({user: userId});
    
    if(endIndex < events.length) {
        results.next = {
            page: page + 1,
            limit,
            href: `http://localhost:3001/api/events/byuser?page=${page+1}&limit=${limit}`
        }
    }

    if(startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit,
            href: `http://localhost:3001/api/events/byuser?page=${page-1}&limit=${limit}`
        }
    }
    
    results.results = events.slice(startIndex, endIndex);
    res.json(results);        
});


eventsRouter.get('/share/:id', async (req, res, next) => {
    const { id } = req.params;
    
    const event = await Event.findById(id);
    if(event)
        res.status(200).json(`Iré a ver a ${event.title} @ ${event.datesArray[0].getDate() < 10 ? '0': null}${event.datesArray[0].getDate()}/${event.datesArray[0].getMonth()+1}/${event.datesArray[0].getFullYear()} http://localhost:3001/api/events/${id} `)        
    else
        next(error);
});

eventsRouter.post('/', userExtractor, async (req, res, next) => {
    const { 
        title,
        description,
        shortDescription,
        datesArray,
        place,
        highLight = false,
        imageUrl,        
    } = req.body;

    const { userId } = req;
    const user = await User.findById(userId);
    // console.error(user);

    if(!title || title === '') {
        return res.status(400).json({
            error: 'required \'title\' field is missing'
        });        
    }
    if(!description || description === '') {
        return res.status(400).json({
            error: 'required \'description\' field is missing'
        });        
    }
    if(!shortDescription || shortDescription === '') {
        return res.status(400).json({
            error: 'required \'shortDescription\' field is missing'
        });        
    }
    if(!datesArray || datesArray === '' || !datesArray.length) {
        return res.status(400).json({
            error: 'required \'datesArray\' field is missing'
        });        
    }if(!place || place === '') {
        return res.status(400).json({
            error: 'required \'place\' field is missing'
        });        
    }if(!imageUrl || imageUrl === '') {
        return res.status(400).json({
            error: 'required \'imageUrl\' field is missing'
        });        
    }

    const newEvent = new Event({
        title,
        description,
        shortDescription,
        datesArray,
        place,
        highLight,
        imageUrl,
        user: userId
    });

    try {
        const savedEvent = await newEvent.save();
        
        user.events = user.events.concat(savedEvent._id);
        await user.save();

        res.json(savedEvent);
    } catch(error) {
        next(error);
    }
});

eventsRouter.delete('/:id', userExtractor, async (req, res, next) => {
    const { id } = req.params;
    const eventToDelete = await Event.find({id})
    if(!eventToDelete) {
        res.status(400).json({
            error: `no event found with id ${id}`
        })
    }

    await Event.findByIdAndDelete(id);
    res.status(204).end();
});

module.exports = eventsRouter;