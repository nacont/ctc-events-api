const ERROR_HANDLERS = {
    CastError: res =>
        res.status(400).send({ error: 'id used is malformed'}),
    
    ValidationError: (res, { message }) => 
        res.status(400).send({ error: message }),

    JsonWebTokenError: res => 
        res.status(401).json({ error: 'token missing or invalid' }),

    TokenExpirerError: res => 
        res.status(401).json({ error: 'token expired'}),

    defaultError: res => 
        res.status(500).end()
}

module.exports = (error, req, res, next) => {    
    console.error(error);
    const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError;
    handler(res, error);
    // if(error.name === 'CastError') {
    //     res.status(400).send({ error: 'id used is malformed'});
    // } else if(error.name === 'ValidationError') {
    //     res.status(400).send({
    //         error: error.message
    //     });
    // } else if(error.name === 'JsonWebTokenError') {
    //     res.status(401).json({
    //         error: 'token missing or invalid'
    //     });
    // } else {
    //     resp.status(500).end();
    // }
}