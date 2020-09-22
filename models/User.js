const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const shema = mongoose.Schema;

let userShema = new shema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
      
    },
    country: {
        type: String
    },
    password: {
        type: String
    }
});

userShema.plugin(uniqueValidator);
module.exports = mongoose.model('User',userShema);

