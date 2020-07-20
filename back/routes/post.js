const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Post, Image, Comment, Introduce, User } = require('../models');
const router = express.Router()
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { removeHtmlAndShorten } = require('./sanitizeMiddle');

try {
    fs.accessSync('uploads');
} catch (err) {
    console.log('폴더 생성...');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname); // 업로드할때 언제 업로드 한지 파일명에 붙혀주기 위해서 확장자만 추출
            const basename = path.basename(file.originalname, ext); // 노드에서 path 모듈 제공, 파일명에 확장자를 붙혀 추출해준다
            done(null, basename + '_' + new Date().getTime() + ext) // 파일명12312312.png
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20mb
});

router.post('/image', upload.array('image'), (req, res, next) => { // image 인풋에 uplaod 해준다. 사진 1개 - single , 사진 여러개 - array, 텍스트 - json
    console.log(req.files) // 여기에 업로드한 이미지들이 있음
    res.json(req.files.map((v) => v.filename))
});

router.post('/', removeHtmlAndShorten ,async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(403).send('로그인 하지 않았습니다')
        }
        const post = await Post.create({
            title : req.body.title,
            content : req.body.content,
            UserId : req.user.id
        });
        if(req.body.image) {
            if( Array.isArray(req.body.image)) { // 이미지를 여러개 올리면 images = [asd.png, ggr.png]
               const images = await Promise.all(req.body.image.map((image) => {
                    return Image.create({ src : image });
                }))
                await post.addImages(images);
            } else { //이미지를 하나만 올리면 image : asd.png
                const image = await Image.create({ src : req.body.image });
                await post.addImages(image)
            }
        }
        const fullPost = await Post.findOne({
            where : {id : post.id},
            include : [{
                model : Image,
            }, {
                model : Comment,
                Include : [{
                    model : User,
                    attributes : ['id', 'nickname']
                }]
            }, {
                model : User,
                attributes : ['id', 'nickname']
            }]
        })
        res.status(201).json(fullPost)
    } catch(err) {
        console.error(err)
        next(err)
    }
})

router.get('/', removeHtmlAndShorten, async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(403).send('로그인 하지 않았습니다')
        }
        const fullPost = await Post.findAll({
            where : {UserId : req.user.id},
            order : [[ 'createdAt', "DESC"]],
            include : [{
                model : Image,
            }, {
                model : Comment,
                Include : [{
                    model : User,
                    attributes : ['id', 'nickname']
                }]
            }, {
                model : User,
                attributes : ['id', 'nickname'],
                include : [{
                    model : Image,
                    attributes : ['src']
                }]
            }]
        })
        res.status(201).json(fullPost)
    } catch(err) {
        console.error(err)
        next(err)
    }
})

module.exports = router;