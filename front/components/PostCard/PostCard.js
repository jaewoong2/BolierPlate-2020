import { useDispatch, useSelector } from 'react-redux'
import { HASHTAG_SEARCH_REQUEST, COVER_POST } from '../../reducer/post';
import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components';
import { Typography } from 'antd';
import PostCardLine from './PostCardLine';
import PostCardHeader from './PostCardHeader';
import PostCardSubInfo from './PostCardSubInfo';


const CenterdDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const PostViewerBlock = styled.div`
  margin-top: 1rem;
  margin-bottom : 1rem;
  width: 90%;
  &:hover {
    transition: all 0.1s ease-in;
  }
`;

const PostHead = styled.div`
  padding-bottom: 0.5rem;
  h1 {
    cursor : pointer;
    font-size: 1.1135rem;
    line-height: 1.5;
    margin: 0;
    font-weight : 500;
  }
`;
const Tags = styled.div`
  margin-left : 0.5rem;
  margin-top: 0.5rem;
  .tag {
    font-size : 11px;
    display: inline-block;
    text-decoration: none;
    margin-right: 3px;
    &:hover {
      color: #4e91cf;
      cursor : pointer;
    }
  }
`;

const PostCard = ({ postData , idx : index }) => {
  const dispatch = useDispatch();
  const { CoverUp, PostsData, tagName } = useSelector(state => state.post)
  const { loginInfo } = useSelector((state) => state.user)
  const [Liker, setLiker] = useState({});

  useEffect(() => {
    setLiker(postData?.Likers?.map(liker => liker?.id === loginInfo?.id ? liker : false).filter(v => v !== false)[0]);
  },[postData, loginInfo])
  
    const searchHashtag = useCallback((tag) => () => {
     tag !== tagName && dispatch({
          type : HASHTAG_SEARCH_REQUEST,
          data : {
              name : encodeURIComponent(tag)
          }
      })
  },[tagName])

const onClickEmpty = useCallback((e) => {
  CoverUp 
  && e.target.nodeName !== 'B' 
  && e.target.nodeName !== 'IMG' 
  && dispatch({
    type : COVER_POST
  })
},[CoverUp])


if(!postData && !index) {
  return <div></div>
}

  return (
    <div onClick={onClickEmpty}>
        <div key={postData + index + 'post' + Math.random() * 300}>
<CenterdDiv>
        <PostViewerBlock>
          <PostHead>
            <PostCardHeader postData={postData} index={index} loginInfo={loginInfo} Liker={Liker}/>
            <PostCardSubInfo postData={postData} loginInfo={loginInfo}/>
            <Tags>
              {postData?.Hashtags?.map((tags, idx) => (
                 <Typography.Text onClick={searchHashtag(tags?.name)} key={tags + '_' + idx} code className="tag">{tags.name}</Typography.Text>
              ))}
            </Tags>
          </PostHead>
        </PostViewerBlock>
      </CenterdDiv>
        {index !== PostsData?.length - 1 &&  Math.floor(index % 2) === 0 &&
         <PostCardLine/>}
        </div>
    </div>
  );
};

export default PostCard;
