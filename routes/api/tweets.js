const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validateTweetInput = require('../../validation/tweets');
const Tweet = require('../../models/Tweet');

//test route.
router.get('/test', (req, res) => {
    res.json({
        msg: 'This is the tweet route'
    });
});

//Index routes - for all the tweets that are currently available.
router.get('/', (req, res) => {
    Tweet  //From our mongoose in the model/Tweet.js
        .find()
        .sort({ date: -1 })   //sort the date in the descending order.
        .then(tweets => res.json(tweets))
        .catch(err => res.status(400).json(err));
});

//To look up all the tweets for that specific user.
router.get('/user/:user_id', (req, res) => {
    Tweet
        .find({ user: req.params.user_id })
        .then(tweets => res.json(tweets))
        .catch(err => res.status(400).json(err));
});

//To get a specific tweet.
router.get('/:id', (req, res) => {
    Tweet
        .findById(req.params.id)
        .then(tweet => res.json(tweet))
        .catch(err => res.status(400).json(err));
});

//To create a tweet.
router.post('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const { isValid, errors } = validateTweetInput(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }

      const newTweet = new Tweet({
        text: req.body.text,
        user: req.user.id
      });

      newTweet
        .save()
        .then(tweet => res.json(tweet));
    }
);


module.exports = router;