import React, { useEffect, useState } from 'react'
import MyLayout from '../components/MyLayout'
import PostCard from '../components/PostCard'
import HashtagSearch from '../components/HashtagSearch'
import { useSelector } from 'react-redux'

const Home = () => {
  const { toggleTag } =  useSelector(state => state.post);


  return (
    <MyLayout>
      {toggleTag && <HashtagSearch/>}
      <PostCard/>  
    </MyLayout>
  )
}

export default Home
