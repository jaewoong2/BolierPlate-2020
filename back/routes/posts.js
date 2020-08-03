const express = require('express');
const { Op } = require('sequelize');
const { removeHtmlAndShorten } = require('./sanitizeMiddle');
const { Post, Image, Comment, User, Hashtag, View } = require('../models');
const router = express.Router();

router.get('/', removeHtmlAndShorten, async (req, res, next) => {
    try {
        const where = {};
        if(parseInt(req.query.lastId, 10)) { //초기 로딩이 아닐때 ,
            where.id ={ [Op.lt] : parseInt(req.query.lastId, 10)} // 보다작은 [Op.lt]
            // where : {id : 9,8,7,6,5,4,3,2,1}
        }
        const fullPost = await Post.findAll({
            where,
            limit : 5,
            order : [[ 'createdAt', "DESC"]],
            include : [{
                model : Image,
            }, {
                model : User,
                attributes : ['id', 'nickname'],
                include : [{
                    model : Image,
                    attributes : ['src']
                }]
            },{
                model : User,
                attributes : ['id', 'nickname'],
                as : 'Likers',
                include : [{
                    model : Image,
                    attributes : ['src']
                }]
            }, {
                model : Hashtag  
            }, {
                model : View,
                attributes : ['id']
            }]
        })
        res.status(201).json(fullPost)
    } catch(err) {
        console.error(err)
        next(err)
    }
})



router.get('/pagenation', removeHtmlAndShorten, async (req, res, next) => {
    try {
        const fullPost = await Post.findAll({
            order : [[ 'createdAt', "DESC"]],
            include : [{
                model : Hashtag
            }],
        })
        res.status(201).json(fullPost)
    } catch(err) {
        console.error(err)
        next(err)
    }
})
module.exports = router;