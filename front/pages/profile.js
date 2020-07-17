import React, { useEffect, useMemo, useCallback, useState } from 'react'
import NavBar from '../components/NavBar'
import { useDispatch, useSelector } from 'react-redux'
import { message, Card, Avatar, Form, Input } from 'antd';
import Router from 'next/router';
import MyLayout from '../components/MyLayout';
import { CheckCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledInput = styled(Input)`
    margin-bottom : 10px;
    border : 0;
    border-bottom : 0.5px solid #dbdbdb;
    background-color : inherit;
    width : 70%;
    input {
        background-color : inherit;
    }
`

const StyledAvartar = styled(Avatar)`
    filter : drop-shadow(5px 5px 20px #1d1e1f6e);

    &:hover {
        cursor : pointer;
    }
`

const StyleDiv = styled.div`
            display : flex;
            align-items : center;
            justify-content : center;
            width : 100%;
            height : 100%;
`

const profile = () => {
    const dispatch = useDispatch();
    const { loginInfo } = useSelector(state => state.user)

    const [changeNickName, setChangeNickName] = useState(false)
    const [nickname, setNickname] = useState(loginInfo?.nickname || 'Dummy')
    
    useEffect(() => {
        !loginInfo.email && (() => {
            message.warn('로그인 후 이용 가능합니다')
            Router.replace('/')
        }) 
    },[loginInfo])

    const cardUseMemo = useMemo(() => {
        return {
            border : 0,
            borderTop : '2px dashed #54a1e96e', 
            backgroundColor : 'inherit ',  
            height : '80%', 
            marginTop : '10px',
        }
    },[])

    const onChangeNickName = useCallback(() => {
        setChangeNickName(prev => !prev)        
    },[])

    const onClickNickName = useCallback(() => {
        // dispatch({
        //     type : "CHANGE_NICKNAME_REQUEST",
        //     data : {
        //         nickname : nickname
        //     }
        // })
    //    !changeNicknameLoading && 
       setChangeNickName(false)
    },[nickname])

    const onChangeInput = useCallback((e) => {
        setNickname(e.target.value)
    },[])

    const onChangeProfileImage = useCallback(() => {
        // 이미지 변경
    },[])

    return (
        <MyLayout>
            {loginInfo.email && <div>{loginInfo.email}</div>}
            <div>
            <StyleDiv>
            <StyledAvartar onClick={onChangeProfileImage} size={300} src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
            </StyleDiv>
            <Card style={cardUseMemo}>
            <Card.Meta   
            title={changeNickName ? <StyledInput type="text" onPressEnter={onClickNickName} suffix={<CheckCircleOutlined onClick={onClickNickName}/>} value={nickname} onChange={onChangeInput}/> : <div name="dbl" onDoubleClick={onChangeNickName}>{loginInfo?.nickname || 'Dummy'}</div>}
            description={loginInfo.email}/>
            자기소개
            </Card>
            </div>
        </MyLayout>
    )
}

export default profile
