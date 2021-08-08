const { model, Schema } = require('mongoose');

const eventSchema = new Schema({
    title: { 
        type: String,
        required: true 
    },
    description: { 
        type: String,
        required: true 
    },
    shortDescription: { 
        type: String,
        required: true 
    },
    datesArray: { 
        type: [Date],
        required: true 
    },
    place: { 
        type: String,
        required: true 
    },
    highLight: { 
        type: Boolean,
        required: true 
    },
    imageUrl: { 
        type: String,
        required: true 
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

eventSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})
const Event = model('Event', eventSchema);

module.exports = Event;