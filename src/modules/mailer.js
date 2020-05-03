const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars')
const path = require('path');

const { host, port, user, pass } = require("../config/mail.json");

var transport = nodemailer.createTransport({
  host: process.env.SENDGRID_API_SMTP,
  port: process.env.SENDGRID_API_PORT,
  auth: {
    user: process.env.SENDGRID_API_USER,
    pass: process.env.SENDGRID_API_PASS
  }
});

const handlebarOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.resolve('./src/resources/mail/'),
    layoutsDir: path.resolve('./src/resources/mail/'),
    defaultLayout: path.resolve('./src/resources/mail/auth/forgot_password'),
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.handlebars',
};

transport.use('compile', hbs(handlebarOptions));




module.exports = transport;