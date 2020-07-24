import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Row, Col, Dropdown } from 'antd'
import styled from 'styled-components';
import NavBar from './NavBar';
import Editor from './Edit/Editor';
import PostView from './PostView';
import PostCard from './PostCard';
import { EditOutlined, HeartFilled, StarOutlined, StarFilled, TagsOutlined } from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import Router, { useRouter } from 'next/router';
import { TOGGLE_TAG } from '../reducer/post';
import { useDispatch } from 'react-redux';

const EditBtn = styled(StarFilled)`
/* border-radius : 50%;
  width : 40px;
  height: 40px; */
  font-size : 40px;
  position : fixed;
  right : 17vw;
  bottom : 13vh;
  /* box-shadow : 3px 3px 10px #777; */
  filter : drop-shadow( 3px 3px 10px #777);
  color : #a4ce61c0;
`

const TagBtn = styled(TagsOutlined)`
/* border-radius : 50%;
  width : 40px;
  height: 40px; */
  font-size : 40px;
  position : fixed;
  left : 16vw;
  bottom : 13vh;
  /* box-shadow : 3px 3px 10px #777; */
  filter : drop-shadow( 3px 3px 10px #777);
  color : #2085a1c7;
`


const ColStyled = styled(Col)`
    height : 80vh;
    width : 100vw;
    background-color : white;
    justify-content : space-between;
    overflow-y : scroll;
    overflow-x : auto;
`

const RowStyled = styled(Row)`
height : 100vh;
display : flex;
justify-content : center;
align-items : center;
`
const MyLayout = ({ children }) => {
    const [resposinveSmall, setResposinveSmall] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const queryname = router.pathname.slice(1);

    useEffect(() => {
      if(typeof window !== 'undefined') {
        window.innerWidth < 769 && setResposinveSmall(true);
      const handleResize = () => {
        if(window.innerWidth < 769) {
          setResposinveSmall(true)
        } else {
          setResposinveSmall(false)
        }
      }
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
    });

    const responsiveSmallBtn = useMemo(() => {
      return { 
        right : '3rem',
      } 
    })
    const LeftBtn = useMemo(() => {
      return {
        left : '2rem'
      }
    })
    
    const clickTag = useCallback(() => {
      dispatch({
        type : TOGGLE_TAG
      })
    },[])

    return (
      <>
    <RowStyled justify="space-between" align="middle">
      <Col  xs={24} md={3}  span={4}>
      </Col>
      <ColStyled xs={24} md={18} span={4}>
        {(!resposinveSmall ? <TagBtn onClick={clickTag}/> : <TagBtn onClick={clickTag} style={LeftBtn}/>)}
            <NavBar />
            {children}
      </ColStyled>
      <Col xs={24} md={3}  span={4}>
      </Col>
    </RowStyled>
    <Dropdown placement="topLeft" overlay={<Text code>Write</Text>}>
    {queryname !== 'write' ? (!resposinveSmall ? <EditBtn onClick={() => Router.replace('/write')}/> : <EditBtn onClick={() => Router.replace('/write')} style={responsiveSmallBtn}/>) : <div></div>}
    </Dropdown>
      </>
    )
}

export default MyLayout
