const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post('/register', (req, res) => {
        if(!req.body.email){
            res.json({success: false, message: 'you must provide email'});
        } else if(!req.body.username) {
            res.json({success: false, message: 'you need to provide username'});
        } else if(!req.body.password) {
            res.json({success: false, message: 'you need to provide a password'});
        } else {
            let newUser = {
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: req.body.password
            }
            User.create(newUser, (err, user) => {
                if(err) {
                    if(err.code === 11000) {
                        res.json({success: false, message: 'username or email already exists'});
                    } else if(err.errors) {
                        if(err.errors.email) {
                            res.json({success: false, message: err.errors.email.message});
                        } else if(err.errors.username) {
                            res.json({success: false, message: err.errors.username.message});
                        } else if(err.errors.password) {
                            res.json({success: false, message: err.errors.password.message});
                        } else {
                            res.json({success: false, message: err});
                        }
                    } else {
                        res.json({success: false, message: 'could not create user. Error: ' + err});
                    }
                } else {
                    res.json({success: true, message: 'Account registered'});
                }
            });
        }
        
    });

    router.get('/check-email/:email', (req, res) => {
        if(!req.params.email) res.json({success: false, message: 'E-mail was not provided'});
        else {
            User.findOne({email: req.params.email}, (err, user) => {
                if(err) res.json({success: false, message: err});
                else {
                    if(user) res.json({success: false, message: 'E-mail already exists'});
                    else res.json({success: true, message: 'E-mail is available'});
                }
            });
        }
    });

    router.get('/check-email/', (req, res) => {
        res.json({success: false, message: 'E-mail was not provided'});
    });

    router.get('/check-username/:username', (req, res) => {
        if(!req.params.username) res.json({success: false, message: 'Username was not provided'});
        else {
            User.findOne({username: req.params.username}, (err, user) => {
                if(err) res.json({success: false, message: err});
                else {
                    if(user) res.json({success: false, message: 'Username already exists'});
                    else res.json({success: true, message: 'Username is available'});
                }
            });
        }
    });

    router.get('/check-username', (req, res) => {
        res.json({success: false, message: 'Username was not provided'});
    });

    router.post('/login', (req, res) => {
        if(!req.body.username) res.json({success: false, message: 'Username not provided'});
        else if(!req.body.password) res.json({success: false, message: 'Password not provided'});
        else {
            User.findOne({username: req.body.username}, (err, user) => {
                if(err) res.json({success: false, message: err});
                else {
                    if(!user) {
                        res.json({success: false, message: `The username ${req.body.username} is not registered`})
                    } else {
                        const validPassword = user.verifyPassword(req.body.password);
                        if(!validPassword) res.json({success: false, message: 'Invalid password'});
                        else {
                            const token = jwt.sign({userId: user._id}, config.secret, {expiresIn: '24h'});
                            res.json({success: true, message: 'Success!', token: token, user: {username: user.username}});
                        }
                    }
                }
            });
        }
    });

    return router;
}