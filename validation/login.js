const Validator = require('validator'); //import validator from validator package.
const validText = require('./valid-text');

module.exports = function(data) {
    let errors = {};

    //Check if keys for email and password exists on the data object.
    data.email = validText(data.email)? data.email : '';
    data.password = validText(data.password)? data.password : '';

    //check the format for email.
    if(!Validator.isEmail(data.email)){
        errors.email = 'Email is invalid!';
    }
    //Check if the email field is empty
    if(Validator.isEmpty(data.email)){
        errors.email = 'Email field is required';
    }
    //Check if password not empty
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};
