const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');
const authConfig = require('../../config/auth');
const crypto = require('crypto');
const mailer = require('../../modules/mailer')


const router = express.Router();

router.post('/register', async (request, response) =>{
    const {email} = request.body
    try{

        if (await User.findOne({email})){
            return response.status(400).send({ error: "Usuario já existe"})
        }
            
        const user  = await User.create(request.body);
        user.password = undefined
        return response.send({user})
    
    }catch(error){
        return response.status(400).send({ error: 'Registration failed'});
    }
        
});

router.post('/authenticate', async (req,res) => {
    const {email, password} = req.body

    const user = await User.findOne({email}).select('+password');

    if (!user){
        return res.status(400).send({ error: 'user not found'})
    }
        

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'invalid password'})

        user.password = undefined

        const token = jwt.sign({ id: user.id}, authConfig.secret, {
            expiresIn: 86400
        })
        return res.send({user, token})
})

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body
    

    try {
        const user = await User.findOne({email});

        if(!user)
        return res.status(400).send({ error: "User not found"})

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        
        now.setHours(now.getHours() + 1);
        

        await User.findByIdAndUpdate( user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        })
    mailer.sendMail({
        to: email,
        from: 'contatoapp4pets@gmail.com',
        template: 'auth/forgot_password',
        context: { token },
        
        },(err) => {
            if(err)
                return res.status(400).send({ error: "Cannot send forgot password mail, try again."})

                return res.send();
            })

    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "error forgot password"});
    }
})

module.exports = app => app.use('/auth', router);