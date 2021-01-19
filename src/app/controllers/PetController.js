const express = require('express');
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');
const admin = require('../../modules/firebase-config')
const uploadConfig = require('../../config/upload')
const Pet = require('../models/Pet')
const User = require('../models/User')

const router = express.Router();
const upload = multer(uploadConfig);

router.use(authMiddleware)

router.post('/create', upload.single('thumbnail'), async (request, response) => {
    console.log(request.body)
    const {location: url= '' } = request.file;
    const { name, breed, dateOfBirth, color} = request.body;
    const  user_id  = request.userId;
    
    try{
        const user = await User.findById(user_id)
        if(!user)
            return response.status(400).send({ error : "Usuario não encontrado"});

        const pet = await Pet.create({
            name,
            breed,
            thumbnail: url,
            dateOfBirth,
            color,
            user: user_id,
            
        })
        console.log(pet)
    
        await pet.populate('user').execPopulate();
        return response.json(pet)
    }catch(error){
        
    }
});

router.get('/index', async (request, response) => {

    const  user_id  = request.userId;
    try {
        const pets = await Pet.find({user: user_id});

        return response.json(pets)
    } catch (error) {
        console.log(error)
    }

        
});

router.get('/index/:id', async (request, response) => {

    const {id} = request.params;
    try {
        const pet = await Pet.findById(id);
        return response.json(pet)
    } catch (error) {
        console.log(error)
    }

        
});

router.delete('/delete/:id', async (request, response) =>{
        const {id} = request.params;
    try {
        console.log(id)
        await Pet.findOneAndDelete(id);
        return response.send()
    } catch (error) {
        return response.status(400).json({error: 'Não foi possivel excluir'})
    }
});

router.post('/notification' , async (request, response) => {
    console.log(request.body)
    const notification_options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
      };

    const  registrationToken = request.body.registrationToken
    const message = request.body.message
    const options =  notification_options

    admin.messaging().sendToDevice(registrationToken, message, options)
    .then( response => {
console.log(this.response)
        response.status(200).send("Notification sent successfully")
     
    })
    .catch( error => {
        console.log(error);
    });

})



module.exports = app => app.use('/pet', router);