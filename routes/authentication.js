const User = require('../models/user');

module.exports = (router) => {

    router.post('/register', (req, res) => {
        if(!req.body.email){
            res.json({sucess: false, message: 'you must provide email'});
        } else if(!req.body.username) {
            res.json({sucess: false, message: 'you need to provide username'});
        } else if(!req.body.password) {
            res.json({sucess: false, message: 'you need to provide a password'});
        } else {
            let newUser = {
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: req.body.password
            }
            User.create(newUser, (err, user) => {
                if(err) {
                    if(err.code === 11000) {
                        res.json({sucess: false, message: 'username or email already exists'});
                    } else if(err.errors) {
                        if(err.errors.email) {
                            res.json({sucess: false, message: err.errors.email.message});
                        } else if(err.errors.username) {
                            res.json({sucess: false, message: err.errors.username.message});
                        } else if(err.errors.password) {
                            res.json({sucess: false, message: err.errors.password.message});
                        } else {
                            res.json({sucess: false, message: err});
                        }
                    } else {
                        res.json({sucess: false, message: 'could not create user. Error: ' + err});
                    }
                } else {
                    res.json({sucess: true, message: 'Account registered'});
                }
            });
        }
        
    });

    return router;
}