const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.singup_user = (req, res, next) => {
    User.find({ email: req.body.email}).exec()
    .then(user => {
        if (user.length >=1) {
            res.status(409).json({
                message: 'User already exists!'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result => {
                        console.log(user);
                        res.status(201).json({
                            message: 'User Created!'
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    });
                }
            });
        }
    });
    
};

exports.login_user = (req, res, next) => {
    User.find({ email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }
            if (result) {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1h'
                    }
                );
                return res.status(200).json({
                    message: 'Authentication successful',
                    token: token
                })
            }
            return res.status(401).json({
                message: 'Authentication failed'
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.delete_user = (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/users/signup',
                body: { email: "String", password: "Number"}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
