const uniqueValidator = require('mongoose-unique-validator');
const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: { 
        type: String,
        unique: true,
        required: true
    },
    name: { type: String,
            required: true 
    },
    passwordHash: { type: String,
                    required: true
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
})

userSchema.plugin(uniqueValidator);

const User = model('User', userSchema);

module.exports = User;