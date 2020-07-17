import React, { useCallback, useState } from "react";
import { Menu, Drawer } from "antd";
import { ArrowLeftOutlined, MenuOutlined } from "@ant-design/icons";
import SubMenu from "antd/lib/menu/SubMenu";
import ModalForm from "./ModalForm";

const NavBar = () => {
    const [current, setCurrent] = useState("");
    const [visible, setVisible] = useState(false);
    const [setting, setSetting] = useState('');

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

  return (
    <Menu
      style={{ backgroundColor: "#f5f0f0b0" }}
      onClick={handleClick}
      selectedKeys={[current]}
      mode="horizontal"
    >
      <Menu.Item key="back" icon={<ArrowLeftOutlined />} />
      <SubMenu  style={{ float : 'right' }} icon={<MenuOutlined />}>
          <Menu.ItemGroup title={null}>
            <Menu.Item onClick={onModalLogin} key="setting:1">로그인</Menu.Item>
            <Menu.Item onClick={onModalSignUp} key="setting:2">회원가입</Menu.Item>
          </Menu.ItemGroup>

         {/* 로그인 후 menu 설정하기 */}
        </SubMenu>
        {visible && <ModalForm setting={setting} setVisible={setVisible} visible={visible}/>}
        {visible && <ModalForm setting={setting} setVisible={setVisible} visible={visible}/>}
    </Menu>
  );
};

export default NavBar;
