import { useDispatch, useSelector } from 'react-redux'
import { LOAD_MYINFO_REQUEST } from '../reducer/user';
import { DELETE_POST_REQUEST, HASHTAG_SEARCH_REQUEST, LOAD_POSTS_REQUEST, COVER_POST } from '../reducer/post';
import React, { useEffect, useCallback } from 'react'
import styled from 'styled-components';
import { Avatar, Dropdown, Menu, Typography } from 'antd';
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
    align-items : center;

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
    
`

const AvartarStyle = styled(Avatar)`
margin-left: 5px;
 margin-right: 5px; 
 overflow : hidden ;
`

const PostCard = ({ postData : v, idx : i }) => {
  const dispatch = useDispatch();
  const { CoverUp, PostsData, CoverUserId, tagName } = useSelector(state => state.post)
  const { loginInfo } = useSelector((state) => state.user)

  const deletePost = useCallback((id) => () => {
    dispatch({
      type : DELETE_POST_REQUEST,
      data : {
        id
      }
    })
  },[])

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
    id : v?.UserId
  })
  CoverUp && v?.UserId !== CoverUserId && dispatch({
    type : COVER_POST,
    id : v?.UserId
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


if(!v && !i) {
  return <div></div>
}

  return (
    <div onClick={onClickEmpty}>
        <div key={v + i + 'post' + Math.random() * 300}>
<CenterdDiv>
        <PostViewerBlock>
          <PostHead>
              <DivWrapper>
            <Link href={`/page/${v?.id}`}><a><h1 className="title"><span className="number">{i + 1} .</span>{v?.title}</h1></a></Link>
              </DivWrapper>
            <SubInfo>
            <span onClick={onClickUser}>
              {v?.User?.Images && 
              <AvartarStyle
                size={24}
                src={`http://localhost:3055/${v.User?.Images[0]?.src}`}
              ></AvartarStyle>}
              <b>{v?.User?.nickname}</b>
            </span>
              <span>{moment(v?.createdAt).format('YYYY.MM.DD')}</span>
              <span className="edit">{v?.UserId === loginInfo?.id ? 
              <Dropdown 
              placement="bottomRight" 
              overlay={
                <Menu>
                <Menu.Item onClick={() => Router?.replace(`/write?PostId=${v?.id}`)}>수정</Menu.Item>
                <Menu.Item onClick={deletePost(v?.id)}>삭제</Menu.Item>
                </Menu>
            }>
              <SmallDashOutlined/>
              </Dropdown>
               : ''}
               </span>
            </SubInfo>
            <Tags>
              {v?.Hashtags?.map((tags, index) => (
                 <Typography.Text onClick={searchHashtag(tags?.name)} key={tags + '_' + index} code className="tag">{tags.name}</Typography.Text>
              ))}
            </Tags>
          </PostHead>
          {/* <PostContent dangerouslySetInnerHTML={{ __html: v.content.length > 50 ? v.content.slice(0,50) +' ....' : v.content }} /> */}
        </PostViewerBlock>
      </CenterdDiv>
        {i !== PostsData?.length - 1 &&  Math.floor(i % 2) === 0 &&
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
