const express = require('express');
const { Post, Image, Comment, Introduce, User, Hashtag } = require('../models');
const router = express.Router()


router.get('/', async (req, res, next) => {
    try {
        const hashtags = await Hashtag.findAll({
            include : [{
                model : Post,
                attributes : ["id"]
            }]
        });
        const realHash = hashtags.map((v) => {
            if(v.Posts.length === 0) {
                return false
            } else {
                return v
            }
        }).filter(v => v !== false)

        if(!hashtags) {
            return res.status(403).send('해쉬태그가 없습니다')
        }
        res.status(201).json(realHash)
    } catch(err) {
        console.error(err)
        next(err)
    }
})


module.exports = router;