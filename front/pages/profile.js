import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react'
import NavBar from '../components/NavBar'
import { useDispatch, useSelector } from 'react-redux'
import { message, Card, Avatar, Form, Input } from 'antd';
import Router from 'next/router';
import MyLayout from '../components/MyLayout';
import { CheckCircleOutlined, PaperClipOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { UPLOAD_PROFILE_IMAGES_REQUEST, LOAD_USERINFO_REQUEST, LOAD_MYINFO_REQUEST, CHANGE_NICKNAME_REQUEST, CHANGE_INTRODUCE_REQUEST } from '../reducer/user';

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

const StyledTextArea = styled(Input.TextArea)`
    margin-top : 10px;
    background-color : inherit;
    textarea {
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
    const { loginInfo, changeNicknameLoading, changeIntroduceLoading } = useSelector(state => state.user)

    const [changeNickName, setChangeNickName] = useState(false)
    const [changeDiscription, setChangeDiscription] = useState(false)

    const [textArea, setTextArea] = useState(loginInfo?.Introduces?.map(v => v.content) || '');
    const [nickname, setNickname] = useState(loginInfo?.nickname || 'Dummy')

    const imageRef = useRef();

    useEffect(() => {
        !loginInfo.email && (() => {
            message.warn('로그인 후 이용 가능합니다')
            Router.replace('/')
        }) 
    },[loginInfo])
    useEffect(() => {
        changeNicknameLoading && message.info('...닉네임 변경중')
        !changeNicknameLoading && setChangeNickName(false)
    },[changeNicknameLoading])
    useEffect(() => {
        changeNicknameLoading && message.info('...자기소개 변경중')
        !changeIntroduceLoading && setChangeDiscription(false)
    },[changeIntroduceLoading])
    
    useEffect(() => {
        dispatch({
            type : LOAD_MYINFO_REQUEST,
        })
    },[])

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
    },[]);
    const onClickDescription = useCallback(() => {
        setChangeDiscription(prev => !prev)
    },[]);


    const onClickNickName = useCallback(() => {
        dispatch({
            type : CHANGE_NICKNAME_REQUEST,
            data : {
                nickname : nickname
            }
        })
    },[nickname])

    const onEnterBtnIntroduce = useCallback(() => {
        dispatch({
            type : CHANGE_INTRODUCE_REQUEST,
            data : {
                content : textArea
            }
        })
    },[textArea])

    const onChangeInput = useCallback((e) => {
        setNickname(e.target.value)
    },[])
    const onChangeTextArea = useCallback(e => {
        setTextArea(e.target.value)
    },[])

    const onChangeProfileImage = useCallback(() => {
        imageRef.current.click()
    },[imageRef.current])
    

    const onChangeImageInput = useCallback((e) => {
        const imageFormData = new FormData();
        [].forEach.call(e.target.files, (f) => {
            imageFormData.append('image', f)
        });
        dispatch({
            type : UPLOAD_PROFILE_IMAGES_REQUEST,
            data : imageFormData
        })
    },[])


   
    return (
        <MyLayout >
            <div>
            <StyleDiv>
                <Form encType="multipart/form-data">
                    <input type="file" multiple ref={imageRef} onChange={onChangeImageInput} hidden />
                    {loginInfo?.Images ?
            <StyledAvartar onClick={onChangeProfileImage} size={300} src={`http://localhost:3055/${loginInfo?.Images && loginInfo?.Images[0]?.src}`} /> :
            <StyledAvartar onClick={onChangeProfileImage} size={300} src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
        }
                </Form>
            </StyleDiv>
            <Card style={cardUseMemo}>
            <Card.Meta   
            title={changeNickName ? <StyledInput type="text" onPressEnter={onEnterBtnIntroduce} suffix={<CheckCircleOutlined onClick={onClickNickName}/>} value={nickname} onChange={onChangeInput}/> : <div name="dbl" onDoubleClick={onChangeNickName}>{loginInfo?.nickname || 'Dummy'}</div>}
            description={loginInfo.email}/>
            {changeDiscription ? <><StyledTextArea autoSize={{minRows: 6, maxRows: 12}} style={{ marginTop : '10px',}} placeholder="엔터버튼 으로 수정 가능 합니다..." onPressEnter={onEnterBtnIntroduce} onChange={onChangeTextArea} value={textArea}/><EditOutlined style={{ color : '#30ace96e'}} onClick={onEnterBtnIntroduce}/></> : <div style={{ marginTop : '10px'}}>{loginInfo?.Introduces && loginInfo?.Introduces[0]?.content}<EditOutlined style={{ color : '#30ace96e'}} onClick={onClickDescription}/></div>}
            </Card>
            </div>
        </MyLayout>
    )
}

export default profile
