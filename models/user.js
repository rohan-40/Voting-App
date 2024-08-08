const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    contact:{
        type: Number,
        required: true
    },
    email:{
        type: String,
    },
    address:{
        type: String,
        required: true
    },
    aadharCardNumber:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['voter','admin'],
        default:'voter'
    }

})

const User = mongoose.model('User',userSchema);
module.exports = User;