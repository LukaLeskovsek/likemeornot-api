import express from 'express';
import User from '../models/User';
import Likes from '../models/Likes';
import auth from '../utils/authCheck';


const router = express.Router();

router.get('/most-liked', (req, res) => {    
    if(!!auth(req.headers.authorization)){
        console.log('unathorized!!!!!');
        res.status(401).json({errors : {global : "Invalid credentials"}});
    }

    User.find({}, {passwordHash : 0}).sort({likes : -1})
        .then( (users) => {            
            res.json({userList : users});                
        })
        .catch(err => {
            res.status(400).json({errors : {global : "Invalid credentials"}});
        })
});
    
router.get('/user/:id', (req, res) => {
    User.findOne({_id : req.params.id})
        .then(user => {
            res.json({userDetails : user});
        })
        .catch(err => {
            res.status(400).json({errors : {global : "Invalid user call"}});
        })
});

router.post('/user/:id/like', (req, res) => {
    console.log('Liked by user :', req.body.likedByUserEmail);
   
    User.findOne({email : req.body.likedByUserEmail}).then(liker => {
        console.log('-------------------------------------');
        console.log('Liker : ', liker);
        let chkLike = Likes.findOne({userid : req.params.id, likedby : liker._id}).then(res => {
            res.status(400).json({errors : { global : "You allready liked this user."}})
        }).then(() => {
            const newLike = {
                userid : req.params.id,
                likedby : liker._id
            };
            
            new liker  = 

        });

        console.log('Chk like : ', chkLike);
    });
    
    


    User.findOneAndUpdate({_id : req.params.id}, {$inc : { likes : 1}})
        .then(likedUser => {
            res.status(200).json({});
        })
        .catch(err => {
            console.log('ERRRIRRRRORRR : ', err);
            res.status(404).json({errors : {global : "something went wrong"}});
        })
})



export default router;