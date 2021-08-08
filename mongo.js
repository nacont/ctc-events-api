const mongoose = require('mongoose');
const { 
    MONGO_DB_URI, 
    MONGO_DB_URI_TEST, 
    NODE_ENV 
} = process.env;  

const connectionString = NODE_ENV === 'test'
    ? MONGO_DB_URI_TEST
    : MONGO_DB_URI;

// const connectionString = MONGO_DB_URI;

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => {
    console.log('Database connected');
})
.catch( err => {
    console.error(err);
});

// process.on('uncaughtException', error => {
//     console.error(error);
//     // mongoose.connection.disconnect();
//     mongoose.disconnect();
// })



// const event = new Event({
//     title: 'Recital de La Renga',
//     description: 'Streamings en vivo de la mejor banda de la Argentina',
//     datesArray: [new Date(2021,08,15), new Date(2021,09,30)],
//     place: 'Hipodromo de San Isidro',
//     highLight: true,
//     imageUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.ambito.com%2Fespectaculos%2Fmusica%2Fla-renga-dara-un-show-streaming-n5197848&psig=AOvVaw0GifoVv--u6YIqzBnxIAY8&ust=1627861950305000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCNjS08DAjvICFQAAAAAdAAAAABAD'
// });
// event.save()
//     .then(result => {
//         console.log(result);
//         mongoose.connection.close();
//     })
//     .catch(err => {
//         console.error(err);
//     })
// Event.find({})
//     .then(result => {
//         console.log(result);
//         mongoose.connection.close();
//     })
//     .catch(err => {
//         console.error(err);
//     })