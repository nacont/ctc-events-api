const mongoose = require('mongoose');
const { server } = require('../index');
const Event = require('../models/Event');
const User = require('../models/User');
const { 
    api, 
    getTitlesFromEvents,
    getToken
} = require('./helpers');
const { initialEvents } = require('./db');
// AGRUPAR LOS TEST POR RUTAS TIPO POST '/api/events' ETC
describe('events test', () => {

    beforeEach(async () => {
        await Event.deleteMany({});

        initialEvents.forEach(async (event) => {
            const eventObject = new Event(event);
            await eventObject.save();
        });        
    });

    test('events are returned as json', async () => {
        await api
            .get('/api/events')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    });

    test('there are thirty events', async () => {
        const res = await api.get('/api/events')
        expect(res.body).toHaveLength(initialEvents.length)
    });    

    test('some event must contain \'La Renga\'', async () => {
        const { titles } = await getTitlesFromEvents();
        expect(titles).toContain('La Renga');
    });

    test('a valid event can be added', async () => {
        
        const token = await getToken();

        const newEvent = {
            title: 'Nuevo evento de prueba',
            description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',
            shortDescription: 'Nuevo evento de prueba. Nuevo evento de prueba',
            datesArray: [new Date(2021,8,15)],
            place: 'Estadio único de La Plata',
            highLight: false,
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Lorem_ipsum_design.svg/200px-Lorem_ipsum_design.svg.png',
        }

        await api
            .post('/api/events')
            .send(newEvent)
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .expect(200)
            .expect('Content-Type', /application\/json/)
                
        const { titles, res } = await getTitlesFromEvents();
        expect(res.body).toHaveLength(initialEvents.length + 1);
        expect(titles).toContain(newEvent.title);
    });

    test('events without title can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            description: 'Presentación del nuevo album',
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            datesArray: [new Date(2021,8,15)],
            place: 'Estadio único de La Plata',
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events without description can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            datesArray: [new Date(2021,8,15)],
            place: 'Estadio único de La Plata',
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events without shortDescription can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            description: 'Presentación del nuevo album',
            datesArray: [new Date(2021,8,15)],
            place: 'Estadio único de La Plata',
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events without datesArray can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            description: 'Presentación del nuevo album',
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            place: 'Estadio único de La Plata',
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events without place can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            description: 'Presentación del nuevo album',
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            datesArray: [new Date(2021,8,15)],
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });    

    test('events without imageUrl can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            description: 'Presentación del nuevo album',
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            datesArray: [new Date(2021,8,15)],
            place: 'Estadio único de La Plata',
            highLight: true,            
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events with null title can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: null,
            description: 'Presentación del nuevo album',
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            datesArray: [new Date(2021,8,15)],
            place: 'Estadio único de La Plata',
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events with null description can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            description: null,
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            datesArray: [new Date(2021,8,15)],
            place: 'Estadio único de La Plata',
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events with null shortDescription can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            description: 'Presentación del nuevo album',
            shortDescription: null,
            datesArray: [new Date(2021,8,15)],
            place: 'Estadio único de La Plata',
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events with null datesArray can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            description: 'Presentación del nuevo album',
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            datesArray: null,
            place: 'Estadio único de La Plata',
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events with null place can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            description: 'Presentación del nuevo album',
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            datesArray: [new Date(2021,8,15)],
            place: null,
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events with null imageUrl can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            description: 'Presentación del nuevo album',
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            datesArray: [new Date(2021,8,15)],
            place: 'Estadio único de La Plata',
            highLight: true,
            imageUrl: null
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });
    
    test('events with blank title can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: '',
            description: 'Presentación del nuevo album',
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            datesArray: [new Date(2021,8,15)],
            place: 'Estadio único de La Plata',
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events with blank description can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            description: '',
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            datesArray: [new Date(2021,8,15)],
            place: 'Estadio único de La Plata',
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events with blank shortDescription can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            description: 'Presentación del nuevo album',
            shortDescription: '',
            datesArray: [new Date(2021,8,15)],
            place: 'Estadio único de La Plata',
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events with blank datesArray can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            description: 'Presentación del nuevo album',
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            datesArray: '',
            place: 'Estadio único de La Plata',
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events with blank place can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            description: 'Presentación del nuevo album',
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            datesArray: [new Date(2021,8,15)],
            place: '',
            highLight: true,
            imageUrl: 'https://www.zona-zero.net/images/noticias/2016/04/TheFallOfTroy%20-%20OK%20-%20Front_small.jpg'
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('events with blank imageUrl can\'t be added', async () => {
        const token = await getToken();
        const newEvent = {
            title: 'Los oportunistas del conurbano',
            description: 'Presentación del nuevo album',
            shortDescription: 'Presentación del nuevo album. Presentación del nuevo album',
            datesArray: [new Date(2021,8,15)],
            place: 'Estadio único de La Plata',
            highLight: true,
            imageUrl: ''
        }

        await api
            .post('/api/events')
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .send(newEvent)
            .expect(400)
        
        const res = await api.get('/api/events');
        expect(res.body).toHaveLength(initialEvents.length);
    });

    test('an event can be deleted', async () => {
        const { res: firstResponse } = await getTitlesFromEvents();
        const { body: events } = firstResponse;
        const eventToDelete = events[0];
        const token = await getToken();

        await api
            .delete(`/api/events/${eventToDelete.id}`)
            .set({'Content-Type': 'application/json', 'Authorization': token})
            .expect(204)
        
        const { titles, res: secondResponse } = await getTitlesFromEvents();
        expect(secondResponse.body).toHaveLength(initialEvents.length - 1)
        expect(titles).not.toContain(eventToDelete.title);
    });

    test('an event can\'t be deleted without being logged in', async () => {
        
        await api
            .delete('/api/events/1234')
            .expect(401)
        
        const { res } = await getTitlesFromEvents();
        expect(res.body).toHaveLength(initialEvents.length);
    })
    
    afterAll( () => {
        mongoose.connection.close();
        mongoose.disconnect();
        server.close();
    });
});