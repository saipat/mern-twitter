const express = require('express');
const router = express.Router();
//Import the User model
const User = require('../../models/User');
//Import bCrypt
const bCrypt = require('bcryptjs');
//Import secret key(include the keys object to this file.)
const keys = require('../../config/keys');
//Import jwt
const jwt = require('jsonwebtoken');
//Import passport
const passport = require('passport');
//import validators
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


//Testing the route for the user.
router.get('/test', (req, res) => {
    res.json( { msg: 'This is the user route' });
});

//Write a route to register a new User.
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    // Check to make sure nobody has already registered with a duplicate email
    User.findOne({ email: req.body.email})
    .then(user => {
        if (user) {
            // Throw a 400 error if the email address already exists
            return res.status(400).json({email: "A user is already registered with that email"});
        }else{
            // Otherwise create a new user
            const newUser = new User({
                handle: req.body.handle,
                email: req.body.email,
                password: req.body.password
            });

            //Use bCrypt to generate salt and hash the password. Assign the hash to the newUser's password.
            bCrypt.genSalt(10, (err, salt) => {
                bCrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            const payload = {
                                id: user.id,
                                handle: user.handle
                            };

                            jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                                res.json({
                                success: true,
                                token: "Bearer " + token
                                });
                            });
                        })
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

//Write the login route
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

//Find the user email. If there is no email display an err msg else compare the password.
    User.findOne({ email })
        .then(user => {
            if(!user){
                return res.status(404).json({ email: 'This user does not exists.' });
            }
            bCrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) { //if there is a match,create and send a jwt back to the user.
                        const payload = {      
                            id: user.id,       //MongoDb id
                            handle: user.handle,
                            email: user.email
                        };                      
                        jwt.sign(
                            payload, 
                            keys.secretOrKey,     //secret key from keys.js
                            { expiresIn: 3600 }, //options hash
                            (err, token) => {
                                res.json({ 
                                    success: true, 
                                    token: 'Bearer ' + token 
                                });
                            }
                        );
                    }else {
                        return res.status(400).json({ password: 'Incorrect password!'});
                    }
                });
        });
});

router.get('/current', passport.authenticate('jwt', {session: false}), 
    (req, res) => {
        res.json({
            id: req.user.id,
            handle: req.user.handle,
            email: req.user.email
    });
});

module.exports = router;