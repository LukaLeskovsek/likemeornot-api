import mongoose from 'mongoose';
import BC from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator  from 'mongoose-unique-validator';

const schema = new mongoose.Schema({
        email: {
            type: "string",
            required: true,
            lowercase: true,
            index: true,
            unique : true
        },
        passwordHash: {
            type: "string",
            required: true
        },
        firstname :{
            type : "string"
        },
        lastname : {
            type : "string"
        },
        bio : {
            type : "string"
        },
        likes : {
            type : "number"
        }
    }, {
    timestamps: true
});

schema.plugin(uniqueValidator);

schema.methods.generateJWT = function generateJWT() {
    return jwt.sign(
        {
            email : this.email,
            id : this._id
        },
        process.env.JWT_SECRET_KEY
    );
}

schema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn : "15min"}
    )
}

schema.methods.isValidPassword = function isValidPassword(password) {
    return BC.compareSync(password.toString(), this.passwordHash)
};

schema.methods.toAuthJSON = function toAuthJSON() {
    return {
        email : this.email,
        id : this._id,
        token : this.generateJWT()
    }
}

schema.methods.setPassword = function setPassword(password) {
    this.passwordHash = BC.hashSync(password, 10);
}

schema.methods.generateResetPasswordLink = function generateResetPasswordLink() {
    return `${process.env.HOST}/reset_password/${this.generateResetPasswordToken}`
} 

export default mongoose.model('User', schema);