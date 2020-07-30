import React, { useCallback, useState, useEffect, useMemo } from "react";
import { Menu, Drawer, Input, Popover } from "antd";
import { ArrowLeftOutlined, MenuOutlined, SearchOutlined, TagsOutlined, InfoCircleOutlined } from "@ant-design/icons";
import SubMenu from "antd/lib/menu/SubMenu";
import ModalForm from "./ModalForm";
import Router, { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux";
import { LOG_OUT_REQUEST } from "../reducer/user";
import styled from "styled-components";
import UseInput from "../Hooks/UseInput";
import { HASHTAG_SEARCH_REQUEST, LOAD_POSTS_REQUEST, COVER_POST } from "../reducer/post";
import Infomation from "./Infomation/Infomation";

const StyledImageForMenu = styled.img`
    width : 35px;
    height : 35px;
    border-radius : 50%;

  &:hover {
    transform : rotate(-45deg);
  }
transition : transform 0.3s;

`

const StyledDivForLogo = styled.div`
  width : 40px;
  
  img {
    &:hover {
  transform : rotate(45deg);
}
    width : 100%;
    transition : transform 0.3s;
  }
 

`
const DivWrapper = styled.div`
  position : sticky;
  top : 0;
  z-index : 3;
`

const StyledMenuForInputSearch = styled(Menu.Item)`
    padding : 0px;
    padding-right: 10px;
    padding-left: 10px;
    border : 0px;
    margin : 0;
    margin-top: 0px;
    margin-bottom : 0px;
  `

const StyledInputSearch = styled(Input.Search)`
`

const NavBar = () => {
    const [current, setCurrent] = useState("");
    const [visible, setVisible] = useState(false);
    const [setting, setSetting] = useState('');
    const [tag, setTag, onChangeTag] = UseInput('');
    const [searchVisible, setSearchVisible] = useState('');
    
    const { loginInfo } = useSelector((state) => state.user)
    const { CoverUp, tagName , loadPostsLoading, loadPostsDone ,hashtagSearchLoading, hashtagSearchDone } = useSelector((state) => state.post)
    const dispatch = useDispatch()
    const router = useRouter()
    const queryname = router.pathname.slice(1);

    const onClickVisble = useCallback(() => {
      setSearchVisible(prev => !prev)
    })

  const handleClick = useCallback((e) => {
    setCurrent(e.key);
  }, []);
 
  const onModalLogin = useCallback(() => {
    setSetting('Login')
    setVisible(prev => !prev);
  },[])

  const onModalSignUp = useCallback(() => {
    setSetting('SignUp')
    setVisible(prev => !prev);
  },[])

  const onBackClick = useCallback((e) => {
    e.key !== 'back' && !queryname && Router.reload();
    e.key !== 'back' && queryname && Router.replace('/')
    // e.key === 'back' && dispatch({
    //   type : COVER_POST
    // })
  },[loadPostsLoading, loadPostsDone, queryname, tagName])
  
  


  const onLogOut = useCallback(() => {
    dispatch({
      type : LOG_OUT_REQUEST
    })
  },[])
  
  const onClickProfile = useCallback(() => {
    Router.push('/profile')
  },[])

  
  const searchHashtag = useCallback(() => {
    tagName !== tag && dispatch({
        type : HASHTAG_SEARCH_REQUEST,
        data : {
            name : encodeURIComponent(tag)
        }
    })
    queryname && Router.replace('/')
},[tag, queryname, tagName])

const LogoStyleMemo = useMemo(() => {
  return {
    padding : '0px',
    margin : '0px',
  }
},[])

const MenuStyleMemo = useMemo(() => {
  return {
    backgroundColor: "white", 
    boxShadow : '0px 15px 10px -15px #111', 
    marginBottom : '10px', 
    position : 'sticky'
  }
},[])

const SubMenuFloatRigth = useMemo(() => {
  return {
    // width : '40px',
    // paddingLeft : '0px',
    // paddingRight : '0px',
    padding : 0,
    float : 'right'
  }
},[])

const FullDIv = useMemo(() => {
  return {
   width : '100%',
   height : '100%',
  }
},[])




 return (
<DivWrapper>
    <Menu
      style={MenuStyleMemo}
      onClick={handleClick}
      overflowedIndicator={null}
      // selectedKeys={[current]}
      mode="horizontal"
    >
      <Menu.Item key="logo" onClick={onBackClick} style={LogoStyleMemo} icon={<StyledDivForLogo><img src="http://localhost:3055/뼈다구.png" /></StyledDivForLogo>}  />
      <StyledMenuForInputSearch style={{borderBottomWidth: '0px'}}>
          <Popover placement="right" title={null} content={<StyledInputSearch placeholder="찾고 싶은 태그가 있나요?" loading={hashtagSearchLoading} onPressEnter={searchHashtag} onSearch={searchHashtag} onChange={onChangeTag} value={tag}/>} trigger="click">
            <div style={FullDIv}>
            <SearchOutlined />
            </div>
          </Popover>
      </StyledMenuForInputSearch>
      <SubMenu style={SubMenuFloatRigth} icon={loginInfo?.Images ? <StyledImageForMenu src={`http://localhost:3055/${loginInfo?.Images[0]?.src}`}/> : <MenuOutlined /> }>
        {!loginInfo?.email ? (
      <Menu.ItemGroup title={null}>
            <Menu.Item onClick={onModalLogin} key="setting:1">로그인</Menu.Item>
            <Menu.Item onClick={onModalSignUp} key="setting:2">회원가입</Menu.Item>
          </Menu.ItemGroup>) : 
        (<Menu.ItemGroup title={null}>
            <Menu.Item onClick={onClickProfile} key="setting:1">내 정보</Menu.Item>
            <Menu.Item onClick={onLogOut} key="setting:2">로그아웃</Menu.Item>
          </Menu.ItemGroup>)}
        </SubMenu>
        {visible && <ModalForm setting={setting} setVisible={setVisible} visible={visible}/>}
        {visible && <ModalForm setting={setting} setVisible={setVisible} visible={visible}/>}
    </Menu>
    </DivWrapper>
  );
};

export default NavBar;
