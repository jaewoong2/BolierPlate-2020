import React, { useCallback, useState, useEffect } from "react";
import { Menu, Drawer } from "antd";
import { ArrowLeftOutlined, MenuOutlined } from "@ant-design/icons";
import SubMenu from "antd/lib/menu/SubMenu";
import ModalForm from "./ModalForm";
import Router, { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux";
import { LOG_OUT_REQUEST } from "../reducer/user";
import styled from "styled-components";

const DivWrapper = styled.div`
  position : sticky;
  top : 0;
`

const NavBar = () => {
    const [current, setCurrent] = useState("");
    const [visible, setVisible] = useState(false);
    const [setting, setSetting] = useState('');
    
    const { loginInfo } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const router = useRouter()

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
  return (
<DivWrapper>
    <Menu
      style={{backgroundColor: "#f5f0f0", boxShadow : '0px 15px 10px -15px #111', marginBottom : '10px', position : 'sticky'}}
      onClick={handleClick}
      overflowedIndicator={null}
      // selectedKeys={[current]}
      mode="horizontal"
    >
      <Menu.Item key="back" onClick={onBackClick} icon={<ArrowLeftOutlined />} />
      <Menu.Item key="logo" onClick={onBackClick} style={{ fontWeight : 'bolder' }}  >
          Logo
      </Menu.Item>
      <SubMenu style={{float : 'right' }}  icon={<MenuOutlined />}>
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
