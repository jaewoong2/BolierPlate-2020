import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { UserOutlined, LockOutlined, NodeExpandOutlined, LoadingOutlined, UserAddOutlined, KeyOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import UseInput from '../../Hooks/UseInput'
import useStyle from '../../Hooks/useStyle'
import { useSelector, useDispatch } from 'react-redux'
import { LOG_IN_REQUEST, REGISTER_USER_REQUEST } from '../../reducer/user'
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

const SignUpForm = () => {
    const { loginInfo, registerUserLoading, registerUserDone, registerUserError } = useSelector(state => state.user);
    const [register, setRegister] = useState(false);
    const [watch, setWatch] = useState(true);
    const [watchConfirm, setWatchConfirm] = useState(true); 

    const dispatch = useDispatch();
    
    const [email, setEmail, onChangeEmail] = UseInput(undefined);
    const [password, setPassword, onChangePassword] = UseInput(undefined);
    const [passwordConfirm, setPasswordConfirm, onChangePasswordConfirm] = UseInput(undefined);
    const [nickname, setNickname, onChangeNickname] = UseInput(undefined);
    
    const errorMemoEmail = useStyle(email);
    const errorMemoPassword = useStyle(password);
    const errorMemoPasswordConfirm = useStyle(passwordConfirm);
    const errorMemoPasswordConfirmWrong = useStyle(password === passwordConfirm);
    const errorMemoNickName = useStyle(nickname);

    useEffect(() => {
      if(loginInfo?.email) {
        return <div>로그인 되어있습니다.</div>
    }
    },[loginInfo])
  

const onFinish = useCallback(() => {
    dispatch({
        type : REGISTER_USER_REQUEST,
        data : {
            email : email,
            password : password,
            nickname : nickname
        }
    })
    setRegister(true)
}, [email,
    password,
    nickname]);

useEffect(() => {
    register && !registerUserLoading && setVisible(false)
    register && !registerUserLoading && message.info('회원가입 성공')
},[registerUserLoading, registerUserDone, register])


const onClickWatch = useCallback((value) => () => {
    value === 'watch' && setWatch(prev => !prev)
    value === 'watchConfirm' && setWatchConfirm(prev => !prev)
},[])

const onClickCancelBtn = useCallback((value) => () => {
    value === email && setEmail(undefined);
    value === nickname && setNickname(undefined);
},[email, nickname])

    return (
        <StyledDivForInputWrapper>
            <div>
                <form autoComplete="on" onSubmit={onFinish}>
                    
            <InputCustom 
            icon={<UserAddOutlined/>} 
            name={"email"} 
            value={email} 
            onChange={onChangeEmail} 
            suffix={<div onClick={onClickCancelBtn(email)} className={email ? 'cancelBtn' : 'hidden'}>X</div>}
            placeholder={"이메일"} />
            <div className="error" style={errorMemoEmail}>이메일을 입력해주세요..</div>

            <InputCustom
            icon={<LockOutlined/>} 
            name={watch && "password"} 
            value={password}
            onChange={onChangePassword}
            suffix={
            <div onClick={onClickWatch('watch')} className={password ? 'cancelBtn' : 'hidden'}>
               {watch ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
            </div>}
            placeholder={"비밀번호"} />
            <div className="error" style={errorMemoPassword}>비밀번호를 입력해주세요..</div>

            <InputCustom
            icon={<KeyOutlined/>} 
            name={watchConfirm && "password"} 
            value={passwordConfirm} 
            onChange={onChangePasswordConfirm}
            suffix={<div onClick={onClickWatch('watchConfirm')} className={passwordConfirm ? 'cancelBtn' : 'hidden'}>
               {watchConfirm ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                </div>}
            placeholder={"비밀번호 확인"} />
            {passwordConfirm && passwordConfirm !== password ? 
            <div className="error" style={errorMemoPasswordConfirmWrong}>비밀번호가 틀렸습니다..</div>:
            <div className="error" style={errorMemoPasswordConfirm}>비밀번호를 확인해주세요..</div>
            } 
            <InputCustom 
            icon={<UserAddOutlined/>} 
            name={"nickname"} 
            value={nickname} 
            onChange={onChangeNickname} 
            suffix={<div onClick={onClickCancelBtn(nickname)} className={nickname ? 'cancelBtn' : 'hidden'}>X</div>}
            placeholder={"닉네임"} />
            <div className="error" style={errorMemoNickName}>닉네임을 입력해주세요..</div>

            
            <div className="login">
                <button type="submit" className="loginBtn">{registerUserLoading ? <LoadingOutlined/> : '회원가입'}</button>
            </div>
            {<div className="errormessage">{registerUserError}</div>}
                </form>
            </div>                
        </StyledDivForInputWrapper>
    )
}

export default SignUpForm
