const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const passportConfig = require('./passport');
const db = require('./models');
const userRouter = require('./routes/user')
// const postRouter = require('./routes/post')
// const postsRouter = require('./routes/posts');
// const hashtagRouter = require('./routes/hashtag');
// 모듈


const app = express();
const PORT = 3055;


dotenv.config();
app.use(morgan('dev')); // 로그남기기

db.sequelize.sync({
    // force : true
    // alter : true
  })
    .then(() => {
      console.log('db 연결 성공');
    })
    .catch(console.error);
app.use(cors({
    origin : 'http://localhost:3000',
    credentials : true, // 쿠키를 같이 보냄
}))

app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended : true }))
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    saveUninitialized : false,
    resave : false,
    secret : process.env.COOKIE_SECRET,
}))

///패스포트
passportConfig()
app.use(passport.initialize());
app.use(passport.session());

// 라우터 설정
app.use('/user', userRouter);
// app.use('/post', postRouter);
// app.use('/hashtag', hashtagRouter);
// app.use('/posts', postsRouter)



app.listen(PORT, () => {
    console.log(`${PORT}서버 실행중`)
})