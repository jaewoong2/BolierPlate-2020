import React, { useCallback, useState, useEffect, useMemo } from "react";
import { Menu, Drawer, Input, Popover } from "antd";
import { ArrowLeftOutlined, MenuOutlined, SearchOutlined, TagsOutlined } from "@ant-design/icons";
import SubMenu from "antd/lib/menu/SubMenu";
import ModalForm from "./ModalForm";
import Router, { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux";
import { LOG_OUT_REQUEST } from "../reducer/user";
import styled from "styled-components";
import UseInput from "../Hooks/UseInput";
import { HASHTAG_SEARCH_REQUEST } from "../reducer/post";

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
  
  input {
  }
  span {
  }
  .ant-btn-primary {
  }
`

const NavBar = () => {
    const [current, setCurrent] = useState("");
    const [visible, setVisible] = useState(false);
    const [setting, setSetting] = useState('');
    const [tag, setTag, onChangeTag] = UseInput('');
    const [searchVisible, setSearchVisible] = useState('');
    
    const { loginInfo } = useSelector((state) => state.user)
    const { hashtagSearchLoading, hashtagSearchDone } = useSelector((state) => state.post)
    const dispatch = useDispatch()
    const router = useRouter()

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

  const onBackClick = useCallback(() => {
    // Router.back()
    // router.pathname === '/' && 
    Router.replace('/')
  },[])
  
  // 
  // 
  const onLogOut = useCallback(() => {
    dispatch({
      type : LOG_OUT_REQUEST
    })
  },[])
  
  const onClickProfile = useCallback(() => {
    Router.push('/profile')
  },[])

  
  const searchHashtag = useCallback(() => {
    dispatch({
        type : HASHTAG_SEARCH_REQUEST,
        data : {
            name : encodeURIComponent(tag)
        }
    })
},[tag])

const LogoStyleMemo = useMemo(() => {
  return {
    fontWeight : 'bolder',
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
      <Menu.Item key="back" onClick={onBackClick} icon={<ArrowLeftOutlined />} />
      <Menu.Item key="logo" onClick={onBackClick} style={LogoStyleMemo}  >
          Logo
      </Menu.Item>
      <StyledMenuForInputSearch style={{borderBottomWidth: '0px'}}>
          <Popover placement="right" title={null} content={<StyledInputSearch onPressEnter={searchHashtag} onSearch={searchHashtag} onChange={onChangeTag} value={tag}/>} trigger="click">
            <div style={FullDIv}>
            <SearchOutlined />
            </div>
          </Popover>
      </StyledMenuForInputSearch>
      <SubMenu style={SubMenuFloatRigth}  icon={<MenuOutlined />}>
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
