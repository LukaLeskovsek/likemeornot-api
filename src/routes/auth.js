import express from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import {isAuthenticated} from '../utils/authCheck';
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
    .catch(err => {
        res.status(401).json({errors : {global : "Invalid credentials"}});
    })
});

router.post('/me/validate-token', (req, res) =>{
    jwt.verify(req.body.token, process.env.JWT_SECRET_KEY, (err) => {
        if(err){
            res.status(400).json({errors : {global : "Error verifying token"}});
        }
        else{
            res.json({});
        }
    })
});

router.get('/me',  isAuthenticated, (req,res) => {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            User.findOne({email : decoded.email})
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
        })
    };
})

export default router;