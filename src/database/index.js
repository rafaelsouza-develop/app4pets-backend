const mongoose = require('mongoose');

const URL_PRODUCTION = 'mongodb+srv://rafaelsouza:R@fael123@omnistack-lvlon.mongodb.net/app4pets?retryWrites=true&w=majority'
const URL_DEVELOPER = 'mongodb+srv://rafaelsouza:R@fael123@omnistack-lvlon.mongodb.net/app4pets_dev?retryWrites=true&w=majority'
const URL_TESTS = 'mongodb+srv://rafaelsouza:R@fael123@omnistack-lvlon.mongodb.net/app4pets_test?retryWrites=true&w=majority'


let DATABASE_URL

switch(process.env.NODE_ENV){
    case 'test':
        DATABASE_URL = URL_TESTS;
        break;
    case 'production' : 
        DATABASE_URL = URL_PRODUCTION;
        break;
    case 'developer' : 
        DATABASE_URL = URL_DEVELOPER;
        break;
    default:
        DATABASE_URL = URL_DEVELOPER;
        break;
    

}

mongoose.connect(DATABASE_URL,{ 
    useCreateIndex: true,
    useNewUrlParser: true ,
    useUnifiedTopology: true,
    useFindAndModify: false},
 );

 


module.exports = mongoose;
