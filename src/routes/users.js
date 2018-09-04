import express from 'express';
import User from '../models/User';
import Likes from '../models/Likes';
import {isAuthenticated} from '../utils/authCheck';

const router = express.Router();

router.get('/most-liked', isAuthenticated, (req, res) => {    
    User.find({}, {passwordHash : 0}).sort({likes : -1})
        .then( (users) => {            
            res.json({userList : users});                
        })
        .catch(err => {
            res.status(400).json({errors : {global : "Invalid credentials"}});
        })
});
    
router.get('/user/:id', (req, res) => {
    User.find({_id : req.params.id},{passwordHash : 0})
        .then(user => {
            res.json({userDetails : user});
        })
        .catch(err => {
            res.status(400).json({errors : {global : "Invalid user call"}});
        })
});

async function getUserIdByEmail(userEmail){
    return User.find({email : userEmail})
        .then(user => {
            return user[0]._id;
        })
        .catch(err => {
            console.log('Error getting user id by his email.', err);
            return '';
        });
};

async function chkLikesByUserId(likedUserId, likerId) {
    return Likes.find({userid : likedUserId, useridlikedby : likerId})
        .then(l => {
            if(l  && l.length > 0){
                return true;
            }else{
                return false;
            }
        })
        .catch(err => {
            console.log('Error checking likes for selected user', err);
            return false;
        })
}

async function getLikeIdByUserId(userId){
    return Likes.find({userid : userId})
        .then(l => {
            console.log('Get like ID for selected user', l);
            return l[0]._id
        })
        .catch(err => { console.log('Error getting like id',err); return ''});
}

router.post('/user/:id/like', isAuthenticated, async (req, res) => {
    let user_id = '';
    await getUserIdByEmail(req.body.likedByUserEmail).then(uid => user_id = uid);
    
    if(user_id === ''){
        res.status(401).json({errors : {global : "No Authorization"}});
        return;
    }
    
    let userAlreadyLiked = false;
    await chkLikesByUserId(req.params.id, user_id).then(liked => userAlreadyLiked = liked);
 
    if(userAlreadyLiked) {
        res.status(400).json({errors : {global : "You can only like one person once!"}});
        return;
    };

    const newLike  = new Likes({
        userid : req.params.id,
        useridlikedby : user_id
    });     
    
    await newLike.save().then(like => {
        User.findOneAndUpdate({_id : req.params.id}, {$inc : { likes : 1}})
            .then( (usr) =>{
                if(usr) {
                    res.status(200).json({});
                }            
            }).catch(err => {
                console.log('Like save error : ', err);
                res.status(404).json({errors : {global : err}});   
            })
    }) 
    
});

router.post('/user/:id/unlike', isAuthenticated, async (req, res) => {
    let user_id = '';
    await getUserIdByEmail(req.body.likedByUserEmail).then(uid => user_id = uid);
    
    if(user_id === ''){
        res.status(401).json({errors : {global : "No Authorization"}});
        return;
    }
    
    let likeId = '';
    await getLikeIdByUserId(req.params.id).then(id => likeId = id);
 
    if(!likeId) {
        res.status(400).json({errors : {global : "You did not like this person not even once!"}});
        return;
    };

    await Likes.deleteOne({_id : likeId}).then(like => {
        User.findOneAndUpdate({_id : req.params.id}, {$inc : { likes : -1}})
        .then( (usr) =>{
            if(usr) {
                res.status(200).json({});
            }            
        }).catch(err => {
            console.log('Like save error : ', err);
            res.status(404).json({errors : {global : err}});   
        })  
    });         
});

export default router;