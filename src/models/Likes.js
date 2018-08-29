import mongoose from 'mongoose';

const schema = new mongoose.Schema({
        userid: {
            type: "string",
            required: true,
            index: true,
            unique : true
        },
        useridlikedby: {
            type: "string",
            required: true,
            index : true
        }
    }, {
    timestamps: true
});


export default mongoose.model('Likes', schema);