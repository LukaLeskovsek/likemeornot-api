import express from 'express';
import User from '../models/User';

const router = express.Router();

router.post('/', (req, res) => {
    const { email, password, firstname, lastname, bio} = req.body.user;

    const newUser = new User({
        'email' : email.toString(),
        'firstname' : firstname.toString(),
        'lastname' : lastname.toString(),
        'bio' : bio.toString(),
        'likes' : 0
    });

    
    User.findOne({email : email.toString()}, (err, result) =>{
        if(err){
            res.status(400).json({errors : {global : "Something went wrong when checking email!"}});
        }
        if(result){
            res.status(400).json({errors : {global : "User already exists!"}});
        }    
    }).catch(err => res.status(400).json({errors : {global : "Something went wrong when checking email!"}}));

    newUser.setPassword(password.toString());

    newUser.save()
        .then(userRecord => {
            res.json({ user: userRecord.toAuthJSON() });
        })
        .catch(err => {
            res.status(400).json({err});
        });
});
    
export default router;