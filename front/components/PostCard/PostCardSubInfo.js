import React, { useCallback } from 'react'
import styled from 'styled-components';
import { Dropdown, Menu, Avatar } from 'antd';
import Router from 'next/router';
import { ToolOutlined } from '@ant-design/icons';
import { COVER_POST, DELETE_POST_REQUEST } from '../../reducer/post';
import moment from 'moment';
import 'moment/locale/ko'
import { useDispatch } from 'react-redux';
moment.locale('ko')
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

  .tool {    
    &:hover {
      cursor: pointer;
      transform : rotate(45deg); 
      color : #ad0303bd;
      transition : transform 0.4s, color 0.4s;
    }
  }
`;

const AvartarStyle = styled(Avatar)`
    margin-left: 5px;
    margin-right: 5px; 
    overflow : hidden ;
`

const PostCardSubInfo = ({ postData, loginInfo,  }) => {
    const { deletePostLoading, CoverUp, CoverUserId } = useCallback((state) => state.post);
    const dispatch = useDispatch();

    const deletePost = useCallback(() => {
    !deletePostLoading && dispatch({
          type : DELETE_POST_REQUEST,
          data : {
            id : postData?.id
          }
        })
      },[deletePostLoading, postData?.id])
    
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
    
    const onClickEdit = useCallback(() => {
        Router?.replace(`/write?PostId=${postData?.id}`)
    },[postData])


    return (
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
    <Menu.Item onClick={onClickEdit}>수정</Menu.Item>
    <Menu.Item onClick={deletePost}>삭제</Menu.Item>
    </Menu>
}>
  <ToolOutlined className="tool" rotate={-90} size={6}/>
  </Dropdown>
   : ''}
   </span>
</SubInfo>
    )
}

export default PostCardSubInfo
