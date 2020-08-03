import React, { useEffect, useCallback } from 'react'
import MyLayout from '../components/MyLayout'
import PostCard from '../components/PostCard/PostCard'
import HashtagSearch from '../components/HashtagSearch'
import { useSelector, useDispatch } from 'react-redux'
import { LOAD_POSTS_REQUEST, HASHTAG_SEARCH_REQUEST } from '../reducer/post'
import { LOAD_MYINFO_REQUEST } from '../reducer/user'
import wrapper from '../store/configureStore';
import { END } from 'redux-saga';
import axios from 'axios';

const Home = () => {
  const { toggleTag, InfinityScroll, PostsData, loadPostsLoading, hashtagSearchLoading, tagName, PageNation } =  useSelector(state => state.post);
  const dispatch = useDispatch();

    const scrollHandler = useCallback((e) => {
      if(e.target.clientHeight + e.target.scrollTop + 15 > e.target.scrollHeight) {
        if(!PageNation && !tagName && InfinityScroll && !loadPostsLoading) {
          e.target === e.currentTarget && dispatch({
            type : LOAD_POSTS_REQUEST,
            lastId : PostsData[PostsData.length - 1]?.id
          })
        }
        if(!PageNation && tagName && InfinityScroll && !hashtagSearchLoading) {
          e.target === e.currentTarget && dispatch({
            type : HASHTAG_SEARCH_REQUEST,
            data : { name : encodeURIComponent(tagName)},
            lastId : PostsData[PostsData.length - 1]?.id
          })
        }
      }
  },[InfinityScroll, PostsData, loadPostsLoading, hashtagSearchLoading, tagName])

  useEffect(() => {
    !tagName && dispatch({
      type : LOAD_POSTS_REQUEST,
    })
  },[tagName])

  useEffect(() => {
    if(PostsData?.length === 5) {
      if(!PageNation && !tagName && InfinityScroll && !loadPostsLoading) {
        dispatch({
          type : LOAD_POSTS_REQUEST,
          lastId : PostsData[PostsData.length - 1]?.id
        })
      }
      if(!PageNation && tagName && InfinityScroll && !loadPostsLoading) {
        dispatch({
          type : HASHTAG_SEARCH_REQUEST,
          data : { name : encodeURIComponent(tagName)},
          lastId : PostsData[PostsData.length - 1]?.id
        })
      }
      }
  },[PostsData,
    tagName,
    InfinityScroll,
    loadPostsLoading, PageNation])

  return (
    <>
    <MyLayout onScrollHandler={scrollHandler}>
      {toggleTag && <HashtagSearch/>}
      {PostsData?.map((v, i) => <PostCard postData={v} idx={i} />)}
    </MyLayout>
    </>
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
      type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch({
      type: LOAD_MYINFO_REQUEST,
  });
  context.store.dispatch(END); // dispatch가 끝나는것을 기다려줌
  await context.store.sagaTask.toPromise(); // saga 서버사이드를 위해서
}); // 이부분이 home 보다 먼저 시작된다

export default Home;
