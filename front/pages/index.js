import React, { useEffect, useState } from 'react'
import MyLayout from '../components/MyLayout'
import PostCard from '../components/PostCard'
import HashtagSearch from '../components/HashtagSearch'

const Home = () => {
  return (
    <MyLayout>
      <HashtagSearch/>
    <PostCard/>  
    </MyLayout>
  )
}

export default Home
