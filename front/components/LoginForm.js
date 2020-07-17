import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import ModalForm from './ModalForm';
import { useDispatch, useSelector } from 'react-redux'
import { LOG_IN_REQUEST } from '../reducer/user';

const LoginForm = ({ setVisible : LoginFinish }) => {
    const { loginLoading, loginDone, loginInfo } = useSelector(state => state.user); 
    const [visible, setVisible] = useState(false) 
    const dispatch = useDispatch();

  const onFinish = useCallback((value) => {
      dispatch({
          type : LOG_IN_REQUEST,
          data : value
      })
      loginDone && !loginLoading && LoginFinish(() => {
          console.log('실행')
          return false
      })
  },[loginLoading, loginDone])

  const onClickModal = useCallback(() => {
    setVisible(prev => !prev);
  })

  if(loginInfo) {
      return <div>이미 로그인 되었습니다.</div>
  }

    return (
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: '이메일 작성 해주세요' }]}
              >
                <Input type="email" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="E-mail" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '비밀번호를 작성 해주세요' }]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember</Checkbox>
                </Form.Item>
              </Form.Item>
        
              <Form.Item>
                <Button loading={loginLoading} type="primary" htmlType="submit" className="login-form-button">
                  로그인
                </Button>
                 {/* <Link href="/signup"> */}
                     <a href="#" onClick={onClickModal} style={{ float : 'right'}} >회원가입</a>
                     <ModalForm setting='SignUp' visible={visible} setVisible={setVisible}/>
                     {/* </Link> */}
              </Form.Item>
            </Form>
          );
};

export default LoginForm;
