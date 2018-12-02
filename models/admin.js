const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minlength: 4,
        maxlength: 255
    },
});

adminSchema.methods.generateAuthToken = function() {
    return jwt.sign({_id: this._id}, config.get('jsonTokenPrivKey'));
}

const Admin = mongoose.model('Admin', adminSchema);



function validateAdmin(admin){
    const schema = {
        username: Joi.string().required().min(3).max(50),
        password: Joi.string().required().min(4).max(255)
    }

    return Joi.validate(admin, schema);
}

module.exports = {
    Admin: Admin,
    validate: validateAdmin
}

