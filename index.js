require('dotenv').config();
require('./mongo');

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Event = require('./models/Event');

const notfound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');
// const userExtractor = require('./middleware/userExtractor');
const logger = require('./loggerMiddleware');

const usersRouter = require('./controllers/users');
const eventsRouter = require('./controllers/events');
const loginRouter = require('./controllers/login');

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api/users', usersRouter);
app.use('/api/events', eventsRouter);
app.use('/api/login', loginRouter);

// cuando tenemos un error queremos que se dirija al proximo middleware que maneje el error
// INTENTÓ ENTRAR EN TODAS LAS RUTAS, COMO NO COINCIDIO CON NINGUNA RUTA, DEVOLVIÓ UN 404
app.use( notfound );

// middleware al cual enviaremos cuando de error
app.use( handleErrors );

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = {
    app,
    server
};