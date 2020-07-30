const express = require('express');
const { Comment, User, Image, Post } = require('../models');
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

router.delete('/:commentId', async(req, res, next) => {
    try {
        if(!req.user) {
            return res.status(403).send('로그인후 삭제 가능합니다...')
        }
        const commentid = req.params.commentId;
        const comment = await Comment.findOne({
            where : {id : req.params.commentId}
        })
        await Comment.destroy({ where : { CommentId : comment.id }})
        await Comment.destroy({ where : { id : commentid, UserId : req.user.id }})

        res.status(201).send('삭제 성공')
    } catch(err) {
        console.error(err)
        next(err)
    }
})



module.exports = router;