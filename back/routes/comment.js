const express = require('express');
const { Comment, User, Image } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/:postId', async(req, res, next) => {
    try {
        const postid = req.params.postId;
        const lastid = parseInt(req.query.lastId, 10);
        const where = {};
        if(lastid !== 0) {
            where.id = { [Op.lt] : lastid };
        }
        where.PostId = postid;
        const comments = await Comment.findAll({
             where,
             limit : 5,
             include : [{
                 model : User,
                 attributes : ["id", "nickname"],
                 include : [{
                     model : Image,
                     attributes : ["src"]
                 }]
             }]
        })
        if(!comments) {
            return res.status(403).send('잘못된 게시글 정보 입니다..')
        }
        
        res.status(201).json(comments);
    } catch(err) {
        console.error(err)
        next(err)
    }
})



module.exports = router;