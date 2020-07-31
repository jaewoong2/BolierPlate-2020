import { useDispatch, useSelector } from 'react-redux'
import { LOAD_MYINFO_REQUEST } from '../reducer/user';
import { DELETE_POST_REQUEST, HASHTAG_SEARCH_REQUEST, LOAD_POSTS_REQUEST, COVER_POST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST } from '../reducer/post';
import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components';
import { Avatar, Dropdown, Menu, Typography, message } from 'antd';
import Link from 'next/link';
import moment from 'moment';
import 'moment/locale/ko'
import { SmallDashOutlined, HeartTwoTone, CiCircleTwoTone, SmileOutlined } from '@ant-design/icons';
import  Router from 'next/router';
moment.locale('ko')

const LineStyledDiv = styled.span`
  margin : 3px;
  width : 100%;
  border-bottom : 0.5px solid #777;
`
const LineWrapperDiv = styled.span`
   display : flex;
    align-items : center;
    margin-left : 4vw;
    margin-top : 3px;
    width : 90%;
`
const CircleDiv = styled.span`
    border-radius : 50%;
    padding : 5px;
    border : 1px solid gray;
    background-color: #1818d1c0; 
    width : 3px;
    height: 3px;
`

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

const SubInfo = styled.div`
  margin-top: 0.5rem;
  color: #434343;
  float : right;

  img {
    &:hover {
      cursor : pointer;
    }
  }
  b {
    font-size : 11.5px;
    &:hover {
      color : #777;
      cursor : pointer;
    }
  }
  /* span 사이에 가운뎃점 문자 보여 주기 */
  span + span:before {
    color: #434343;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    content: "\\B7"; /* 가운뎃점 문자 */
  }
  span {
    font-size : 11.5px;
  }
  .edit {
   margin-right : 4px;
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
const PostContent = styled.div`
  margin-left : 10px;
  font-size: 11px;
  color: #434343;
  overflow: auto;
  img {
    width: 100%;
  }
`;

const DivWrapper = styled.div`
    display : flex;
    justify-content : space-between;
    /* align-items : center; */

    .heart {
      font-size : 16px;
      cursor : pointer;
    }
    span {
      color : #686767;
      font-style : italic;
    }

    .title {
      &:hover {
        color : #526a7e;
        font-weight : bolder;
      }
    }

    a{
      display : flex;
    }
    
    .like {
    display : flex;

    .heart {    
        display : flex;
        align-items : center;
        font-size : 15px;
    }    

    span {
        margin-right : 10px;
        font-size : 18px;
        font-style : italic;
    }
    }
    
`

const AvartarStyle = styled(Avatar)`
margin-left: 5px;
 margin-right: 5px; 
 overflow : hidden ;
`

const PostCard = ({ postData , idx : index }) => {
  const dispatch = useDispatch();
  const { CoverUp, PostsData, CoverUserId, tagName, deletePostLoading } = useSelector(state => state.post)
  const { loginInfo } = useSelector((state) => state.user)
  const [Liker, setLiker] = useState({});

  useEffect(() => {
    setLiker(postData?.Likers?.map(liker => liker?.id === loginInfo?.id ? liker : false).filter(v => v !== false)[0]);
  },[postData, loginInfo])

  const deletePost = useCallback((id) => () => {
    !deletePostLoading && dispatch({
      type : DELETE_POST_REQUEST,
      data : {
        id
      }
    })
  },[deletePostLoading])

  const searchHashtag = useCallback((tag) => () => {
   tag !== tagName && dispatch({
        type : HASHTAG_SEARCH_REQUEST,
        data : {
            name : encodeURIComponent(tag)
        }
    })
},[tagName])

const onClickUser = useCallback(() => {
  dispatch({
    type : COVER_POST,
    id : postData?.UserId
  })
  CoverUp && postData?.UserId !== CoverUserId && dispatch({
    type : COVER_POST,
    id : postData?.UserId
  })
},[CoverUp, CoverUserId])

const onClickEmpty = useCallback((e) => {
  CoverUp 
  && e.target.nodeName !== 'B' 
  && e.target.nodeName !== 'IMG' 
  && dispatch({
    type : COVER_POST
  })
},[CoverUp])

const onClickLike = useCallback(() => {
  if(!loginInfo.id) {
    return message.warn('로그인 후 이용 가능합니다')
  } else {
    !Liker && dispatch({
      type : LIKE_POST_REQUEST,
      id : postData.id
    });
    Liker && dispatch({
      type : UNLIKE_POST_REQUEST,
      id : postData.id
    })
  }
},[Liker, postData, loginInfo]);


if(!postData && !index) {
  return <div></div>
}

  return (
    <div onClick={onClickEmpty}>
        <div key={postData + index + 'post' + Math.random() * 300}>
<CenterdDiv>
        <PostViewerBlock>
          <PostHead>
              <DivWrapper>
            <Link href={`/page/${postData?.id}`}>
              <a><h1 className="title">
                <span className="number">{index + 1} .</span>{postData?.title}
                </h1></a></Link>
                <div className="like">
                <HeartTwoTone twoToneColor={Liker ? 'red' : 'gray'} onClick={onClickLike} className="heart" />
                {postData.Likers.length}
                </div>
              </DivWrapper>
            <SubInfo>
            <span onClick={onClickUser}>
              {postData?.User?.Images && 
              <AvartarStyle
                size={24}
                src={`http://localhost:3055/${postData.User?.Images[0]?.src}`}
              ></AvartarStyle>}
              <b>{postData?.User?.nickname}</b>
            </span>
              <span>{moment(postData?.createdAt).format('YYYY.MM.DD')}</span>
              <span className="edit">{postData?.UserId === loginInfo?.id ? 
              <Dropdown 
              placement="bottomRight" 
              overlay={
                <Menu>
                <Menu.Item onClick={() => Router?.replace(`/write?PostId=${postData?.id}`)}>수정</Menu.Item>
                <Menu.Item onClick={deletePost(postData?.id)}>삭제</Menu.Item>
                </Menu>
            }>
              <SmallDashOutlined/>
              </Dropdown>
               : ''}
               </span>
            </SubInfo>
            <Tags>
              {postData?.Hashtags?.map((tags, idx) => (
                 <Typography.Text onClick={searchHashtag(tags?.name)} key={tags + '_' + idx} code className="tag">{tags.name}</Typography.Text>
              ))}
            </Tags>
          </PostHead>
          {/* <PostContent dangerouslySetInnerHTML={{ __html: v.content.length > 50 ? v.content.slice(0,50) +' ....' : v.content }} /> */}
        </PostViewerBlock>
      </CenterdDiv>
        {index !== PostsData?.length - 1 &&  Math.floor(index % 2) === 0 &&
    (<LineWrapperDiv style={{ display : 'flex', justifyContent : 'center' }}>
    {/* <LineStyledDiv></LineStyledDiv>
    <CircleDiv></CircleDiv> */}
    <div  style={{ width : '40%', borderBottom : '2px dashed #777'}}></div>
    <SmileOutlined  style={{ color:"#50db7eea" , fontSize : 17, marginLeft : 7, marginRight : 7}}/>
    <div  style={{  width : '40%', borderBottom : '2px dashed #777'}}></div>
    </LineWrapperDiv>)}
        </div>
    </div>
  );
};

export default PostCard;
