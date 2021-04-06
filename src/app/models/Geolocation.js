const mongoose = require('../../database')
const GeolocationSchema = new mongoose.Schema({

    latitude : {
        type: String,
        require: true
    },
    longitude : {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Geolocation', GeolocationSchema);