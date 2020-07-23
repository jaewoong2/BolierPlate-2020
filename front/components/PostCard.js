import { useDispatch, useSelector } from 'react-redux'
import { LOAD_MYINFO_REQUEST } from '../reducer/user';
import { LOAD_MYPOST_REQUEST, DELETE_POST_REQUEST } from '../reducer/post';
import React, { useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components';
import { Avatar, Dropdown, Menu } from 'antd';
import Link from 'next/link';
import moment from 'moment';
import 'moment/locale/ko'
import { EditTwoTone, WarningOutlined, SmallDashOutlined, LineOutlined } from '@ant-design/icons';
import  Router from 'next/router';
moment.locale('ko')

const CenterdDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const PostViewerBlock = styled.div`
  margin-top: 2rem;
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

  /* span 사이에 가운뎃점 문자 보여 주기 */
  span + span:before {
    color: #434343;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    content: "\\B7"; /* 가운뎃점 문자 */
  }
  .edit {
   margin-right : '4px'
  }

`;

const Tags = styled.div`
  margin-left : 1rem;
  margin-top: 0.5rem;
  .tag {
    display: inline-block;
    color: blue;
    text-decoration: none;
    margin-right: 0.5rem;
    &:hover {
      color: #fad2df;
      cursor : pointer;
    }
  }
`;
const PostContent = styled.div`
  margin-left : 10px;
  font-size: 1.1125rem;
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
    
`

const AvartarStyle = styled(Avatar)`
margin-left: 5px;
 margin-right: 5px; 
 overflow : hidden ;
`

const PostCard = () => {
  const dispatch = useDispatch();
  const { myPost } = useSelector(state => state.post)
  const { loginInfo } = useSelector((state) => state.user)

  useEffect(() => {
      dispatch({
          type : LOAD_MYINFO_REQUEST
      })
      dispatch({
        type : LOAD_MYPOST_REQUEST
    })
  },[])

  useEffect(() => {
    dispatch({
      type : LOAD_MYPOST_REQUEST
  })
  },[loginInfo])

  const lineStyleMemo = useMemo(() => {
    return {
      margin : '3px',
      width : '100%', 
      border : '1px solid #777'
    }
  },[]);

  const lineWrapperMemo = useMemo(() => {
    return {
      display : 'flex', 
      alignItems : 'center',
      marginLeft : '4vw', 
      marginTop : '3px', 
      width : '90%'
    }
  },[]);

  const circleMemo = useMemo(() => {
    return {
      borderRadius : '50%',
      padding : '5px', 
      border : '1px, solid, gray', 
      backgroundColor:'#1818d1c0', 
      width : '14px', 
      height:'14px'
    }
  },[])

  const deletePost = useCallback((id) => () => {
    dispatch({
      type : DELETE_POST_REQUEST,
      data : {
        id
      }
    })
  },[])


  return (
    <div>
      {myPost?.map((v, i) => (
        <>
<CenterdDiv>
        <PostViewerBlock>
          <PostHead>
              <DivWrapper>
            <Link href={`/page/${v.id}`}><a><h1>{v.title}</h1></a></Link>
              </DivWrapper>
            <SubInfo>
            <span>
              <AvartarStyle
                size={32}
                src={`http://localhost:3055/${v.User?.Images[0]?.src}`}
              ></AvartarStyle>
              <b>{v.User?.nickname}</b>
            </span>
              <span>{moment(v.createdAt).format('YYYY.MM.DD')}</span>
              <span className="edit">{v?.UserId === loginInfo?.id ? 
              <Dropdown 
              placement="bottomRight" 
              overlay={
                <Menu>
                <Menu.Item onClick={() => Router.replace(`/write?PostId=${v.id}`)}>수정</Menu.Item>
                <Menu.Item onClick={deletePost(v.id)}>삭제</Menu.Item>
                </Menu>
            }>
              <SmallDashOutlined/>
              </Dropdown>
               : ''}
               </span>
            </SubInfo>
            <Tags>
              <div className="tag">#태그1</div>
              <div className="tag">#태그2</div>
              <div className="tag">#태그3</div>
            </Tags>
          </PostHead>
          <PostContent dangerouslySetInnerHTML={{ __html: v.content.length > 50 ? v.content.slice(0,50) +' ....' : v.content }} />
        </PostViewerBlock>
      </CenterdDiv>
        {i % 2 === 0 ?
    (<div style={lineWrapperMemo}>
    <div style={lineStyleMemo}></div>
    <div style={circleMemo}></div>
    </div>)
     :
    (<div style={lineWrapperMemo}>
    <div style={circleMemo} />
    <div style={lineStyleMemo} />
    </div>)}
        </>
      ))}
    </div>
  );
};

export default PostCard;
