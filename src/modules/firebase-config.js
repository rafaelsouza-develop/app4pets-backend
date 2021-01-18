const admin = require('firebase-admin')
const serviceAccount = require('../config/app4pets-dev-firebase-adminsdk.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
  
  module.exports.admin = admin