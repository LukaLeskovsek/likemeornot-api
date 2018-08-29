import express from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import {sendResetPasswordEmail} from './../utils/mailer';

const router = express.Router();

router.post('/', (req, res) => {
    const { credentials } = req.body;
    User.findOne({email : credentials.email})
        .then( (user) => {
            if(user && user.isValidPassword(credentials.password)){ 
                res.json({user : user.toAuthJSON()});
            }else{
                res.status(401).json({errors : {global : "Invalid credentials"}});
            }    
        })
        .catch(err => {
            res.status(401).json({errors : {global : "Invalid credentials"}});
        })
});
    
router.post('/me/reset-password', (req, res) =>{
    User.find({email : req.body.email}).then(user => {
        if(user){
            sendResetPasswordEmail(user);
            res.json({});
        }else{
            res.status(400).json({errorsr : {global : "Request denied!"}});
        }
    })
});

router.post('/me/validate-token', (req, res) =>{
    jwt.verify(req.body.token, process.env.JWT_SECRET, (err) => {
        if(err){
            res.status(400).json({errors : {global : "Error verifying token"}});
        }
        else{
            res.json({});
        }
    })
});

export default router;