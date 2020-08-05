import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Row, Col, Dropdown } from 'antd'
import styled from 'styled-components';
import NavBar from './NavBar';
import Editor from './Edit/Editor';
import { EditOutlined, HeartFilled, StarOutlined, StarFilled, TagsOutlined, PaperClipOutlined } from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import Router, { useRouter } from 'next/router';
import { TOGGLE_TAG, PAGE_NATION_TOGGLE, COVER_POST, SEARCH_POSTS_FAILURE } from '../reducer/post';
import { useDispatch, useSelector } from 'react-redux';
import ModalForm from './ModalForm';
import PageNation from './PageNation/PageNation';
import Infomation from './Infomation/Infomation';
import LoginForm from './FormComponent/LoginForm';
import SearchForm from './FormComponent/SearchForm';

// const FullDiv = styled.div`
// background-color : #ffffff9d;
// width : 100vw;
// height : 100vh;
// z-index : 3;
// position : fixed;
// backdrop-filter: blur(4px);
// -webkit-backdrop-filter: blur(4px);
// `

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

  &:hover {
    color : #cf934ed7;
    transition : color 0.4s;
  }
  transition : color 0.4s;
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
  &:hover {
    color : #cf934ed7;
    transition : color 0.4s;
  }
  transition : color 0.4s;

`
const PageBtn = styled(PaperClipOutlined)`
  font-size : 40px;
  position : fixed;
  right : 17vw;
  bottom : 19vh;
  /* box-shadow : 3px 3px 10px #777; */
  filter : drop-shadow( 3px 3px 10px #777);
  color : #2085a1c7;
  &:hover {
    color : #cf934ed7;
    transition : color 0.4s;
  }
  transition : color 0.4s;
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
const MyLayout = ({ children, onScrollHandler }) => {
    const [resposinveSmall, setResposinveSmall] = useState(false);
    const [visible, setVisible] = useState(false);
    const [setting, setSetting] = useState('');

    const dispatch = useDispatch();
    const router = useRouter();
    const { loginInfo } = useSelector((state) => state.user);
    const { CoverUp, CoverUpLoading, PageNation : page } = useSelector((state) => state.post);
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
    
    const clickPageNation = useCallback(() => {
      dispatch({
        type : PAGE_NATION_TOGGLE
      })
    },[])

    const clickCoverUp = useCallback((e) => {
      if(e.currentTarget !== e.target) {
        return 
      }
      CoverUp && dispatch({
        type : COVER_POST
      })
    },[CoverUp])

    
const onClickWriteBtn = useCallback(() => { //로그인 안했을 떄.
  if(!loginInfo?.id) {
      setSetting('Login')
        setVisible(prev => !prev);
  } else {
    Router.replace('/write')
  }
},[loginInfo])

const onClickSearchDown = useCallback(() => {
  dispatch({
    type : SEARCH_POSTS_FAILURE,
    error : '다른부분 클릭'
  })
},[])


    return (
      <>
        {/* {CoverUp && <FullDiv onClick={clickCoverUp}  />} */}
    <RowStyled onClickCapture={onClickSearchDown} onClick={clickCoverUp} justify="space-between" align="middle">
      <Col xs={24} md={3}>
      </Col>
      <ColStyled onClick={onClickSearchDown} onScroll={onScrollHandler} xs={24} md={18} span={4}>
      {!queryname && (!resposinveSmall ? <TagBtn onClick={clickTag}/> : <TagBtn onClick={clickTag} style={LeftBtn}/>)}
      {!queryname && (!resposinveSmall ? <PageBtn onClick={clickPageNation}/> : <PageBtn onClick={clickPageNation} style={responsiveSmallBtn}/>)}
      <NavBar />
      {children}
      <Infomation/>
    {visible && <ModalForm setting={setting} setVisible={setVisible} visible={visible}/>}
      </ColStyled>
      <Col xs={24} md={3}  span={4}>
      </Col>
    </RowStyled>
    <SearchForm/>
        {page && (resposinveSmall ? <PageNation resSmall={true}/> : <PageNation/>)}
    <Dropdown placement="topLeft" overlay={<Text code>Write</Text>}>
    {queryname !== 'write' ? (!resposinveSmall ? <EditBtn onClick={onClickWriteBtn}/> : <EditBtn onClick={onClickWriteBtn} style={responsiveSmallBtn}/>) : <div></div>}
    </Dropdown>
      </>
    )
}

export default MyLayout
