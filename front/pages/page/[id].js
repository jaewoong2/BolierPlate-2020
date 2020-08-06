import React, { useEffect, useCallback, useMemo, useState } from 'react'
import Router, { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import MyLayout from '../../components/MyLayout';
import moment from 'moment';
import 'moment/locale/ko'
import styled from 'styled-components';
import { message, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DELETE_POST_REQUEST, HASHTAG_SEARCH_REQUEST, COVER_POST, LOAD_ONE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, LOAD_POSTS_REQUEST } from '../../reducer/post';
import { LOAD_MYINFO_REQUEST } from '../../reducer/user';
import { HeartTwoTone, HeartOutlined, EyeOutlined } from '@ant-design/icons';
import CommentInput from '../../components/Comment/CommentInput';
import CommentContainer from '../../components/Comment/CommentContainer';
import { END } from 'redux-saga';
import wrapper from '../../store/configureStore'
import PostPageSubInfo from '../../components/PostPage/PostPageSubInfo';
import PostPageTagLike from '../../components/PostPage/PostPageTagLike';

const Containertitle = styled.div`
    display : flex;
    margin-left : 9%;
    overflow : auto;
    h1 { 
        font-size : 40px;
        margin : 0;
    }
`

const BorderDiv = styled.div`
    display : flex;
    justify-content : center;
    width : 100%;

    .bode {
    border : 0;
    border-top : 1px solid #777;
    width : 80%;
    }

    h1 {
        font-size : 40px;
    }
`
const PostContent = styled.div`
  font-size: 1.0125rem;
  color: #434343;
  overflow : auto;
  padding-top : 3%;
  padding-left : 9%;
  padding-right : 9%;

  img {
      width :100%;
  }
`;

const QuillStyleDiv = styled.div`
    pre {
        background-color: #23241f;
        color: #f8f8f2;
        overflow: visible;
        white-space: pre-wrap;
        margin-bottom: 5px;
        margin-top: 5px;
        padding: 5px 10px;
        border-radius : 3px;
    }

    blockquote {
        border-left: 4px solid #ccc;
        margin-bottom: 5px;
        margin-top: 5px;
        padding-left: 16px;
    }
`

moment.locale('ko')

const page = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;
    const { loginInfo } = useSelector((state) => state.user);
    const { CoverUp, onePost, loadPostsError, submitCommentDone, submitCommentLoding, deleteCommentDone, deleteCommentLoding } = useSelector((state) => state.post);

 
    useEffect(() => {
        dispatch({
            type : LOAD_ONE_POST_REQUEST,
            id 
        })
    },[loginInfo.id, submitCommentDone && !submitCommentLoding, deleteCommentDone && !deleteCommentLoding])

    useEffect(() => {
        if(onePost === null) {
            message.error('존재하지않는 게시물...')
            Router.back();
        }
    },[onePost])

    useEffect(() => {
        loadPostsError && (() => {
            message.error('에러 발생...');
            Router.back();
        })()
    },[loadPostsError])
    

    const onClickCoverDown = useCallback((e) => {
        CoverUp && dispatch({
            type : COVER_POST,
        })
    },[CoverUp])

    return (
        <MyLayout>
           {onePost?.id ? <div onClick={onClickCoverDown}>

            <Containertitle><h1>{onePost?.title}</h1></Containertitle>

            <PostPageSubInfo post={onePost} />

            <BorderDiv>
               <div className="bode"/>
            </BorderDiv>

            <PostPageTagLike post={onePost}/>

            <PostContent>
            <QuillStyleDiv dangerouslySetInnerHTML={{__html : onePost?.content}}/>
            </PostContent>

            <CommentContainer post={onePost} user={loginInfo}/>
            
            </div> : 
            (<BorderDiv><h1>로딩중...</h1></BorderDiv>)}
        </MyLayout>
    )
}

export const getServerSideProps = wrapper.getServerSideProps( async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = ''; // 로그인 전에는 쿠키 제거
    //로그인이 공유되는 것을 주의해야함 (내 쿠키값이 한번 넣어지고 그게 저장되서)
    if(context.req && cookie) { // 로그인 하고나서는
        axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
        type: LOAD_ONE_POST_REQUEST,
        id : context.params.id,
    });
    context.store.dispatch({
        type: LOAD_MYINFO_REQUEST,
    });
    context.store.dispatch(END); // dispatch가 끝나는것을 기다려줌
    await context.store.sagaTask.toPromise(); // saga 서버사이드를 위해서
  }); // 이부분이 home 보다 먼저 시작된다
  

export default page;
