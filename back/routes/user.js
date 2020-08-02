const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Post, Image, Comment, Introduce, User } = require('../models');
const router = express.Router()
const multer = require('multer');
const path = require('path');
const fs = require('fs');

try {
    fs.accessSync('uploads');
} catch (err) {
    console.log('폴더 생성...');
    fs.mkdirSync('uploads');
}


const upload = multer({
    storage : multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            done(null, basename + '_' + new Date().getTime() + ext);
        },
    }),
    limits : { fileSize : 20 * 1024 * 1024},
});

router.patch('/', async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(403).send('로그인 하지 않았습니다')
        }
        const user = await User.findOne({
            where : {id : req.user.id }
        });
        if(!user) {
            return res.status(403).send('존재하지 않는 회원 입니다')
        }
        await User.update({
            nickname : req.body.nickname
        }, {
            where : { id : user.id }
        })
        res.status(200).json({ nickname : req.body.nickname })
    } catch(err) {
        console.error(err)
        next(err)
    }
})

router.post('/introduce', async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(403).send('로그인 하지 않았습니다.')
        }
        const user = await User.findOne({
            where : { id : req.user.id }
        });
        if(!user) {
            return res.status(403).send('존재하지 않는 유저')
        }
        await Introduce.destroy({
            where : {UserId : user.id}
        })
        const introduce = await Introduce.create({ content : req.body.content })
        await user.addIntroduces(introduce)
        const fullUser = await User.findOne({
            where : { id : user.id },
            attributes : ['email', 'nickname', 'id'],
            include : [{
                model : Post
            }, {
                model : Image,
            }, {
                model : Comment
            }, {
                model : Introduce
            }]
        })
        res.status(200).json(fullUser)
    } catch(err) {
        console.error(err)
        next(err)
    } 
})

router.get('/', async (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(403).send('로그인 하지 않았습니다')
        }
        const user = await User.findOne({
            where : { id : req.user.id }
        });
        if(!user) {
            return res.status(403).send('로그인 하지 않았습니다')
        }
        const fullUser = await User.findOne({
            where : { id : user.id },
            attributes : ['email', 'nickname', 'id'],
            include : [{
                model : Post
            }, {
                model : Image,
                order : [['DESC']]
            }, {
                model : Comment
            }, {
                model : Introduce
            }]
        });
        res.status(201).json(fullUser)
    } catch(err) {
        console.error(err)
        next(err)
    }
})


router.post('/profile', upload.array('image'), async (req, res, next) => {
    console.log(req.files)
    console.log(req.files.map(v => v.filename))
    try {
        const user = await User.findOne({
            where : { id : req.user.id }
        })
        await Image.destroy({
            where : {
                UserId : user.id
            }
        });
        const image = await Image.create({ src : req.files.map(v => v.filename)[0] })
        await user.addImages(image);
        const fullUserWithImage = await User.findOne({
            where : { id : user.id },
            attributes : ['email', 'nickname', 'id'],
            include : [{
                model : Post
            }, {
                model : Image,
                order : [['DESC']]
            }, {
                model : Comment
            }, {
                model : Introduce
            }]
        });
        return res.status(200).json(fullUserWithImage)
    } catch (err) {
        console.error(err)
        next(err)
    }
})



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
                order : [[{ model : Post },'createdAt', "DESC"],[{model : Post, as: 'Liked'},'createdAt', "DESC"]],
                include : [{
                    model : Post
                }, {
                    model : Image
                }, {
                    model : Comment
                }, {
                    model : Introduce
                }, {
                    model : Post,
                    as : 'Liked',
                }]
            });
            return res.status(200).json(fullUserWithoutPassword)
        })
    })(req, res, next);
});


router.get('/:userid', async (req, res, next) => { // 프로필 정보창 받아오기
    try {
        const userid = parseInt(req.params.userid, 10);
        if(!userid) {
            return res.status(403).send('존재 하지않는 유저입니다..')
        }
        const user = await User.findOne({
            where : { id : userid }
        });
        if(!user) {
            return res.status(403).send('로그인 하지 않았습니다')
        }
        const fullUser = await User.findOne({
            where : { id : user.id },
            attributes : ['email', 'nickname', 'id'],
            order : [[ { model : Post }, 'createdAt', "DESC"]],
            include : [{
                model : Post,
            }, {
                model : Image,
                order : [['DESC']],
                attributes : ['src']
            }, {
                model : Comment
            }, {
                model : Introduce
            }, {
                model : Post,
                as : 'Liked',
            }]
        });
        
        res.status(201).json(fullUser)
    } catch(err) {
        console.error(err)
        next(err)
    }
})



router.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
});


module.exports = router;