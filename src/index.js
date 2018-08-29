import express from 'express';
import path from 'path';
import mongoos from 'mongoose';
import auth  from './routes/auth';
import signup from './routes/signup';
import users from './routes/users';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
mongoos.connect(process.env.MONGODB_URL, {useNewUrlParser:true});
app.use(bodyParser.json({ type: 'application/json' }))

app.use('/api/login', auth);
app.use('/api/signup', signup);
app.use('/api', users);

app.get("/", (req, res) => {
    res.json({success : true});
});

module.exports = app.listen(9000, () => console.log("running on localhost 9000"));