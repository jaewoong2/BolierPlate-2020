const express = require('express');
const { Post, Image, Comment, Introduce, User, Hashtag, View } = require('../models');
const router = express.Router()
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { removeHtmlAndShorten } = require('./sanitizeMiddle');
const { Op } = require('sequelize');
const dotenv = require('dotenv');
const {cookieParsers} = require('./parseCookie');

dotenv.config();

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
            console.log(file)
            const basename = path.basename(file.originalname, ext); // 노드에서 path 모듈 제공, 파일명에 확장자를 붙혀 추출해준다
            if(ext) {
                done(null, basename + '_' + new Date().getTime() + ext) // 파일명12312312.png
            } else {
                done(null, basename + '.png');
            }
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20mb
});

router.delete('/unlike/:postid', async(req, res, next) => {
    try {
        const postid = req.params.postid;
        const post = await Post.findOne({
            where : { id : postid } 
        });
        if(!post) {
            return res.status(403).send('존재 하지 않는 게시글...')
        }
         await post.removeLikers(req.user.id);
         const fullpost = await Post.findOne({
            where : {id : post.id},
            include : [{
                model : Image,
            }, {
                model : Comment,
                include : [{
                    model : User,
                    attributes : ['id', 'nickname'],
                    include : [{
                        model : Image
                    }]
                }, {
                    model : Comment
                }]
            }, {
                model : User,
                attributes : ['id', 'nickname'],
                include : [{
                    model : Image,
                    attributes : ['src']
                }]
            }, {
                model : Hashtag,
            }, {
                model : User,
                attributes : ['id', 'nickname'],
                as : 'Likers',
                include : [{
                    model : Image,
                    attributes : ['src']
                }]
            }, {
                model : View,
                attributes : ['id']
            }]
        })
        res.status(201).json(fullpost)
    } catch(err) {
        console(err)
        next(err)
    }
})

router.patch('/like/:postid', async(req, res, next) => {
    try {
        const postid = req.params.postid;
        const post = await Post.findOne({
            where : { id : postid }
        });
        if(!post) {
            return res.status(403).send('존재 하지 않는 게시글...')
        }
        await post.addLikers(req.user.id);
        
        const fullpost = await Post.findOne({
            where : {id : post.id},
            include : [{
                model : Image,
            }, {
                model : Comment,
                include : [{
                    model : User,
                    attributes : ['id', 'nickname'],
                    include : [{
                        model : Image
                    }]
                }, {
                    model : Comment
                }]
            }, {
                model : User,
                attributes : ['id', 'nickname'],
                include : [{
                    model : Image,
                    attributes : ['src']
                }]
            }, {
                model : Hashtag,
            }, {
                model : User,
                attributes : ['id', 'nickname'],
                as : 'Likers',
                include : [{
                    model : Image,
                    attributes : ['src']
                }]
            }, {
                model : View,
                attributes : ['id']
            }]
        })
        res.status(201).json(fullpost)
    } catch(err) {
        console.error(err)
        next(err)
    }
})


router.post('/comment', async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(403).send('로그인 후 이용 가능..')
        }
        const post = await Post.findOne({
            where : { id  : req.body.postid }
        })
        if(!post) {
            return res.status(403).send('존재하지 않는 게시글..')
        }
        await Comment.create({
            content : req.body.comment,
            UserId : req.user.id,
            PostId : post.id,
            CommentId : req.body.commentid,
            // CommentId는 대댓글의 댓글
        })
        
        const fullpost = await Post.findOne({
            where : {id : post.id},
            include : [{
                model : Image,
            }, {
                model : Comment,
                include : [{
                    model : User,
                    attributes : ['id', 'nickname'],
                    include : [{
                        model : Image
                    }]
                }, {
                    model : Comment
                }]
            }, {
                model : User,
                attributes : ['id', 'nickname'],
                include : [{
                    model : Image,
                    attributes : ['src']
                }]
            }, {
                model : Hashtag,
            }, {
                model : User,
                attributes : ['id', 'nickname'],
                as : 'Likers',
                include : [{
                    model : Image,
                    attributes : ['src']
                }]
            }, {
                model : View,
                attributes : ['id']
            }]
        })
        res.status(201).json(fullpost)
    } catch(err) {
        console.error(err)
        next(err)
    }
})


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
            content : req.filtered,
            UserId : req.user.id
        });
        
        if(req.body.image) {
            if( Array.isArray(req.body.image)) { // 이미지를 여러개 올리면 images = [asd.png, ggr.png]
               const images = await Promise.all(req.body.image.map((image) => {
                    return Image.create({ src : image });
                }))
                console.log(images)
                await post.addImages(images);
            } else { //이미지를 하나만 올리면 image : asd.png
                const image = await Image.create({ src : req.body.image });
                await post.addImages(image)
            }
        }

        if(req.body.hashtag) {
                const hashtags = await Promise.all(req.body.hashtag.map((hashtag) => {
                    return Hashtag.findOrCreate({ 
                        where : { name : hashtag.toLowerCase() }
                    })
                }))
                console.log(...hashtags)
                await post.addHashtags(hashtags.map(v => v[0]))
        }

        const fullPost = await Post.findOne({
            where : {id : post.id},
            include : [{
                model : Image,
            }, {
                model : User,
                attributes : ['id', 'nickname']
            }, {
                model : Hashtag,
            }]
        })
        res.status(201).json(fullPost)
    } catch(err) {
        console.error(err)
        next(err)
    }
})

router.patch('/', removeHtmlAndShorten ,async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(403).send('로그인 하지 않았습니다')
        }
        const post = await Post.findOne({
            where : req.body.id,
            UserId : req.user.id
        })
        if(!post) {
            return res.status(403).send('접근 할 수 없는 게시물')
        }
        await Post.update({
            title : req.body.title,
            content : req.filtered,
        }, {
             where : { id : post.id } 
        }
        );
        
        if(req.body.image) {
            await Image.destroy({
                where : { PostId :  req.body.id  }
            });
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
        if(req.body.hashtag) {
            await post.removeHashtags()
            const hashtags = await Promise.all(req.body.hashtag.map((hashtag) => {
                console.log(hashtag)
                return Hashtag.findOrCreate({ 
                    where : { name : hashtag.toLowerCase() }
                })
            }))
            console.log(...hashtags)
            await post.addHashtags(hashtags.map(v => v[0]))
    }

    const fullpost = await Post.findOne({
        where : {id : post.id},
        include : [{
            model : Comment,
            include : [{
                model : User,
                attributes : ['id', 'nickname'],
                include : [{
                    model : Image
                }]
            }, {
                model : Comment
            }]
        }, {
            model : User,
            attributes : ['id', 'nickname'],
            include : [{
                model : Image,
                attributes : ['src']
            }]
        }, {
            model : Hashtag,
        }, {
            model : User,
            attributes : ['id', 'nickname'],
            as : 'Likers',
            include : [{
                model : Image,
                attributes : ['src']
            }]
        }, {
            model : View,
            attributes : ['id']
        }]
    })
    res.status(201).json(fullpost)
    } catch(err) {
        console.error(err)
        next(err)
    }
})


router.get('/', removeHtmlAndShorten, async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(403).json({error : '로그인 하지 않았습니다'})
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
            }, {
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


router.get('/:postId', cookieParsers, async (req, res, next) => {
    try {
        const view = await View.findOne({
            where : { name : req.cookie, PostId : req.params.postId}
        });
        const post = await Post.findOne({
            where : { id : req.params.postId }
        })
        if(!view) {
            const hit = await View.create({
                name : req.cookie
            })
            await post.addViews(hit.id)
        }
        const fullPost = await Post.findOne({
            where : {id : req.params.postId },
            include : [{
                model : View,
                attributes : ["id"]
            }, {
                model : Image,
            }, {
                model : Comment,
                // limit : 5,
                include : [{
                    model : User,
                    attributes : ['id', 'nickname'],
                    include : [{
                        model : Image,
                        attributes : ['src'],
                    }]
                }]
            }, {
                model : User,
                attributes : ['id', 'nickname'],
                include : [{
                    model : Image,
                    attributes : ['src']
                }]
            }, {
                model : User,
                attributes : ['id', 'nickname'],
                as : 'Likers',
                include : [{
                    model : Image,
                    attributes : ['src']
                }]
            }, {
                model : Hashtag
            }]
        })
        res.status(201).json(fullPost)
    } catch(err) {
        console.error(err)
        next(err)
    }
})


router.delete('/:PostId', async(req, res, next) => {
    try {
        if(!req.user) {
            return res.status(403).send('로그인 하지 않은 유저')
        }
        const post = await Post.findOne({
            where : { 
                id : req.params.PostId,
                UserId : req.user.id,
            }
        });
        if(!post) {
            return res.status(403).send('존재하지 않는 글')
        }
        await Post.destroy({
            where : {
                id : req.params.PostId,
                UserId : req.user.id,
            },
        });
        res.status(201).json({ PostId : parseInt(req.params.PostId, 10)});
    } catch (err) {
        console.error(err)
        next(err)
    }
})

router.get('/hashtag/:tagname', async (req, res, next) => {
    try {
        const lastId = parseInt(req.query.lastId);
        const where = {};
        if(lastId) {
            where.id = { [Op.lt] : lastId }
            // where : {id :{ [Op.lt ] : lastId } }
        }
        const tagName = decodeURIComponent(req.params.tagname);
        if(!tagName) {
            return res.status(403).send('잘못된 해쉬태그')
        }
        const hashtagPosts = await Post.findAll({
            where ,
            limit : 5 ,
            order : [[ 'createdAt', "DESC"]],
            include : [{
                model : Hashtag,
                where : { name : tagName }
            }]
        });
        const hashtagWithPosts = await Post.findAll({
            where : { id : hashtagPosts.map(v => v.id) },
            order : [['createdAt', 'DESC']],
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
            }, {
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
        });

        res.status(201).json(hashtagWithPosts)
    } catch(err) {
        console.error(err)
        next(err)
    }
})

module.exports = router;