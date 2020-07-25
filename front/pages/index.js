import React, { useEffect, useState, useCallback } from 'react'
import MyLayout from '../components/MyLayout'
import PostCard from '../components/PostCard'
import HashtagSearch from '../components/HashtagSearch'
import { useSelector, useDispatch } from 'react-redux'
import { LOAD_POSTS_REQUEST, HASHTAG_SEARCH_REQUEST } from '../reducer/post'
import { LOAD_MYINFO_REQUEST } from '../reducer/user'

const Home = () => {
  const { toggleTag, InfinityScroll, PostsData, loadPostsLoading, hashtagSearchLoading, tagName } =  useSelector(state => state.post);
  const dispatch = useDispatch();

    const scrollHandler = useCallback((e) => {
      if(e.target.clientHeight + e.target.scrollTop + 15 > e.target.scrollHeight) {
        if(!tagName && InfinityScroll && !loadPostsLoading) {
          dispatch({
            type : LOAD_POSTS_REQUEST,
            lastId : PostsData[PostsData.length - 1]?.id
          })
        }
        if(tagName && InfinityScroll && !hashtagSearchLoading) {
          dispatch({
            type : HASHTAG_SEARCH_REQUEST,
            data : { name : encodeURIComponent(tagName)},
            lastId : PostsData[PostsData.length - 1]?.id
          })
        }
      }
  },[InfinityScroll, PostsData, loadPostsLoading, hashtagSearchLoading, tagName])

    

  useEffect(() => {
    dispatch({
      type : LOAD_POSTS_REQUEST,
    })          
    dispatch({
      type : LOAD_MYINFO_REQUEST,
    })
  },[])

  return (
    <MyLayout onScrollHandler={scrollHandler}>
      {toggleTag && <HashtagSearch/>}
      {PostsData?.map((v, i) => <PostCard postData={v} idx={i} />)}
    </MyLayout>
  )
}

export default Home
