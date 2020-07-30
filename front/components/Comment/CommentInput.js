import React, { useEffect, useCallback, useState } from 'react'
import { Input, Button, Form, Typography } from 'antd'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import UseInput from '../../Hooks/UseInput'
import { COVER_POST, SUBMIT_COMMENT_REQUEST, RECOMMENT_TOGGLE } from '../../reducer/post'

const StyledDivForReplyTo = styled.div`
    margin-left : 10vw;
    
    .cancel {
        margin-left : 5px;
        color : #f1a1a1e0;
        cursor : pointer;
    }
`
const StyledTypography = styled(Typography.Text)`
    &:hover {
        color : #3009ff;
    }
`

const StyledDivForForm = styled.div`
    width : 70%;
    display : flex;
    textarea {
        resize: none;
        box-shadow : 0;
        border-right : 0;
        border-radius : 5px 0 0 5px;
        scroll-
        &:focus, &:hover {
            border : 1px solid #40a9ff;
            box-shadow : 0 0 0 2px rgba(24, 144, 255, 0.2); 
        }
    }

    button {
        width : 50px;
        height : auto;
        border : 0;
        border-radius : 0 5px 5px 0;
        transition : all 0.2s ease;
        &:focus {
            outline : 0;
        }
        &:hover {
            border : 1px solid #40a9ff;
            background-color : #40a9ff;
            color : white;
            box-shadow : 0 0 0 2px rgba(24, 144, 255, 0.2); 
            transition : all 0.7s ease;
            cursor : pointer;
        }
        
    }

`
const StyledDivForWrapper = styled.div`
    display : flex;
    justify-content : center;
    margin-top : 15px;
    padding-bottom : 50px;
    img {
        border-radius : 50%;
        width : 32px;
        height : 32px;
        margin-right : 15px;
        cursor: pointer;
    }

   
`

const CommetTextArea = styled(Input.TextArea)`
    &:hover {
            outline : 0;
            box-shadow : 0;
            border-color : none;
        }
    &:focus {
        border-color : none;
        box-shadow : 0;
    }
`


const CommentInput = ({user, postid}) => {
    const { RecommentInfo } = useSelector(state => state.post);
    const [commentValue, setCommentValue, onChangeCommentValue] = UseInput('')
    const dispatch = useDispatch();

    useEffect(() => {
        RecommentInfo?.User?.nickname && setCommentValue();
    },[RecommentInfo])

    const onSubmitComment =  useCallback(() => {
        dispatch({
            type : SUBMIT_COMMENT_REQUEST,
            data : {
                postid : postid,
                commentid : RecommentInfo?.id,
                comment : commentValue,
            },
        })
        setCommentValue('');
        RecommentInfo && dispatch({
            type : RECOMMENT_TOGGLE,
            data : {comment : null},
        })
    },[commentValue, user, RecommentInfo])

    const onClickCoverUp = useCallback(() => {
        dispatch({
            type : COVER_POST,
            id : user.id
        })
    })
    
    const onClickCancelBtn = useCallback(() => {
        RecommentInfo && dispatch({
            type : RECOMMENT_TOGGLE,
            data : {comment : null},
        })
    },[RecommentInfo])

    return (
        <>
        <StyledDivForReplyTo>
        {RecommentInfo?.User?.nickname && <StyledTypography code>@{RecommentInfo?.User?.nickname}<sapn onClick={onClickCancelBtn} className="cancel">X</sapn></StyledTypography>}
        </StyledDivForReplyTo>
        <StyledDivForWrapper>
            <div>
    {user?.Images ? <img onClick={onClickCoverUp} src={`http://localhost:3055/${user?.Images[0]?.src}`}/> :<img/>}
            </div>
            <StyledDivForForm>
            <CommetTextArea className="form" autoSize={{maxRows : 1}} value={commentValue} onChange={onChangeCommentValue} />
            <button onClick={onSubmitComment} className="form">등록</button>
            </StyledDivForForm>
        </StyledDivForWrapper>
        </>     
    )
}

export default CommentInput
