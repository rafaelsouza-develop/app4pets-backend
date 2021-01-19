const firebase = require('firebase-admin')
const serviceAccount = require('../config/app4pets-dev-firebase-adminsdk.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://app4pets-dev.firebaseio.com'
  })
  
  module.exports.admin = firebase