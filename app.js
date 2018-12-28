//TO create a new express server.
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
//Import routes.
const users = require('./routes/api/users');
const tweets = require('./routes/api/tweets');
//Import the User model
const User = require('./models/User');
//body-parser: Tell our app what source of req it should respond to
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDb'))
    .catch(err => console.log(err));
    
//Initializing the passport.
app.use(passport.initialize());
//to setup a configuration file for Passport
require('./config/passport')(passport);

//Tell our app to respond to json req.
app.use(bodyParser.json());

//Tell our app to respond to url encoded req.
app.use(bodyParser.urlencoded({
    extended: false
}));

//Basic route to get some render information on the page.
app.get("/", (req, res) => {
    const user = new User({
        handle: 'jim',
        email: 'jim@jim.com',
        password: '123456',
    });
    user.save();
    res.send("Hello World!");
});

//Tell express to use our newly imported routes.
app.use('/api/users', users);
app.use('/api/tweets', tweets);

//To tell our app which port to run on and to deploy on Heroku.
const port = process.env.PORT || 5000;

//Tell Express to start a sockect and listen for connections on the path.
app.listen(port, () => console.log(`Server is running on port ${port}`));