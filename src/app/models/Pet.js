const mongoose = require('../../database')
const PetSchema = new mongoose.Schema({

    name:{
        type: String,
        require: true
    },
    breed: {
        type: String,
        require: true
    },
    size: {
        type: String,
        //require: true
    },
    thumbnail: {
        type: String
    },
    genre: {
        type: String,
        enum: ['MALE','FEMALE'],
        default: 'MALE'
    },
    dateOfBirth :{
        type: Date,
        require: true,
    },
    color: {
        type: String,
        require: true
    },
    species: {
        type: String,
        //require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    geolocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Geolocation'
    }

},{
    toJSON : {
        virtuals: true
    }
});


module.exports = mongoose.model('Pet', PetSchema);
