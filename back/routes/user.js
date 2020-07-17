const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Post, Image, Comment, Introduce, User } = require('../models');
const router = express.Router()

router.post('/', async( req, res, next ) => {
    try {
        const exUser = await User.findOne({
            where : {
                email : req.body.email
            }
        });
        if(exUser) {
            return res.status(403).send('존재하는 이메일')
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 8)

        await User.create({
            email : req.body.email,
            nickname : req.body.nickname,
            password : hashedPassword,
        });

        res.status(201).send('succeess')
    } catch(err) {
        console.error(err)
        next(err)
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, reason) => {
        if(err) {
            console.error(err)
            return next(err)
        }
        if(reason) {
            return res.status(401).send(reason.reason);
        }
        return req.login(user, async(loginErr) => {
            if(loginErr) {
                return next(loginErr)
            }
            const fullUserWithoutPassword = await User.findOne({
                where : { id : user.id },
                attributes : ['email', 'nickname', 'id'],
                include : [{
                    model : Post
                }, {
                    model : Image
                }, {
                    model : Comment
                }, {
                    model : Introduce
                }]
            });
            return res.status(200).json(fullUserWithoutPassword)
        })
    })(req, res, next);
});

router.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
});


module.exports = router;