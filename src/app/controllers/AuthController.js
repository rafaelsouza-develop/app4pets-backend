const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');
const authConfig = require('../../config/auth');
const crypto = require('crypto');
const mailer = require('../../modules/mailer')


const router = express.Router();

router.post('/register', async (request, response) =>{

    console.log(request.body)
    const {email} = request.body
    try{

        if (await User.findOne({email})){
            return response.status(400).send({ error: "Usuario já existe"})
        }
            
        const user  = await User.create(request.body);
        user.password = undefined
        return response.send({user})
    
    }catch(error){
        console.log(error)
        return response.status(400).send({ error: 'Registration failed'});
    }
        
});

router.post('/authenticate', async (req,res) => {
    const {email, password} = req.body

    const user = await User.findOne({email}).select('+password');

    if (!user){
        return res.status(400).send({ error: 'Usuario não encontrado'})
    }
        

    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({ error: 'Senha invalida'})
    }
        

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
        return res.status(400).send({ error: "Usuario não encontrado"})

        const token = crypto.randomBytes(4).toString('hex');

        

        const now = new Date();
        
        now.setHours(now.getHours() + 1);
        
        console.log(token)
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
                return res.status(400).send({ error: "Não foi possivel solicitar recuperação de senha, tente novamente."})

                return res.send();
            })

    } catch (err) {
        return res.status(400).send({ error: "Ops! Tivemos um erro ao tentar recuperar a sua senha."});
    }
})

router.post('/resert_password', async (req, res) => {
const { email, token, password } = req.body;

try{
    const user  = await User.findOne({email})
    .select('+passwordResetToken passwordResetExpires');

   if (!user)
     return res.status(400).send({error: 'Usario não encontrado'});

    if (token  !== user.passwordResetToken) 
      return res.status(400).send ({error: 'Token de recuperação invalido'})

    const now = new Date();

    if (now > user.passwordResetExpires)
    return res.status(400).send({error:'Token expirado, gere novamente um novo token.'});

    user.password = password;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    
    res.send();
    
}catch(err){
    res.status(400).send({error:'Canoot reset password, try again'});
}

});

module.exports = app => app.use('/auth', router);