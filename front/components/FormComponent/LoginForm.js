import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { UserOutlined, LockOutlined, NodeExpandOutlined, LoadingOutlined } from '@ant-design/icons'
import UseInput from '../../Hooks/UseInput'
import useStyle from '../../Hooks/useStyle'
import { useSelector, useDispatch } from 'react-redux'
import { LOG_IN_REQUEST } from '../../reducer/user'
import ModalForm from '../ModalForm'
import InputCustom from './InputCustom'

const StyledDivForInputWrapper = styled.div`
    display : flex;
    width : 100%;
    justify-content : center;
    align-items : center;
    background-color : inherit;
    
            .login {
                display : flex;
                justify-content : space-between;
                align-items : center;
                margin-top : 30px;
                margin-bottom : 10px;
                font-size : 12px;
            }
            
            .loginBtn {
                background-color : #066ef7d7;
                padding : 5px;
                padding-left : 7px;
                padding-right : 7px;
                color : white;
                font-size : 14px;
                border : 1px solid #d9d9d9;
                border-radius : 3px 3px 3px 3px;
                outline : 0;
                &:hover {
                    background-color : #3986ebd7;;
                    cursor : pointer;
                    transition : background-color 0.4s;
                }
            }


            .cancelBtn {
                visibility : visible;
                opacity : 1;
                transition : visibility 0.4s, opacity 0.4s;
                &:hover {
                    cursor: pointer;
                }
            }
            .hidden {
                visibility: hidden;
                opacity : 0;
                transition : visibility 0.4s, opacity 0.4s;
            }

            .errormessage {
                color : #db0a0abd;
                font-size : 13px;
            }
`

const LoginForm = ({ setVisible : LoginFinish }) => {
    const { loginLoading, loginDone, loginInfo, loginError} = useSelector(state => state.user); 
    const [visible, setVisible] = useState(false) 
    const dispatch = useDispatch();
    
    const [email, setEmail, onChangeEmail] = UseInput(undefined);
    const [password, setPassword, onChangePassword] = UseInput(undefined);
    
    const errorMemoEmail = useStyle(email);
    const errorMemoPassword = useStyle(password);

    useEffect(() => {
      loginInfo.id && loginDone && !loginLoading && LoginFinish(() => {
        return false
    })
    },[loginLoading, loginDone, loginInfo.id])

    useEffect(() => {
      if(loginInfo?.email) {
        return <div>이미 로그인 되었습니다.</div>
    }
    },[])
    
  const onFinish = useCallback((e) => {
      e.preventDefault();
      dispatch({
          type : LOG_IN_REQUEST,
          data : {
              email : email,
              password : password,
          }
      })
  },[email, password])

  const onClickModal = useCallback(() => {
    setVisible(prev => !prev);
  })
  const onClickCancelBtn = useCallback((value) => () => {
    value === email && setEmail(undefined);
    value === password && setPassword(undefined);
},[email, password])





    return (
        <StyledDivForInputWrapper>
            <div>
                <form autoComplete="on" onSubmit={onFinish}>
            <InputCustom 
            icon={<UserOutlined/>} 
            name={"email"} 
            value={email} 
            onChange={onChangeEmail} 
            suffix={<div onClick={onClickCancelBtn(email)} className={email ? 'cancelBtn' : 'hidden'}>X</div>}
            placeholder={"이메일"} />
            <div className="error" style={errorMemoEmail}>이메일을 입력해주세요..</div>
             <InputCustom
            icon={<LockOutlined/>} 
            name={"password"} 
            value={password} 
            onChange={onChangePassword}
            suffix={<div onClick={onClickCancelBtn(email)} className={email ? 'cancelBtn' : 'hidden'}>X</div>}
            placeholder={"비밀번호"} />
            <div className="error" style={errorMemoPassword}>비밀번호를 입력해주세요..</div>
            <div className="login">
                <a href="#" onClick={onClickModal} >회원가입</a>
                <button type="submit" className="loginBtn">{loginLoading ? <LoadingOutlined/> : '로그인'}</button>
            </div>
            {<div className="errormessage">{loginError}</div>}
                </form>
                <ModalForm setting='SignUp' visible={visible} setVisible={setVisible}/>
            </div>                
        </StyledDivForInputWrapper>
    )
}

export default LoginForm
