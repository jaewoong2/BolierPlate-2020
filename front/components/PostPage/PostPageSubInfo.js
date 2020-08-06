import React, { useCallback } from 'react'
import styled from 'styled-components'
import { COVER_POST } from '../../reducer/post'
import { useDispatch } from 'react-redux'
import moment from 'moment';
import 'moment/locale/ko'
moment.locale('ko')

const DivContainer = styled.div`
    display : flex;
    justify-content : flex-end;
    padding-left : 5%;
    padding-right : 5%;

    
    p {
        &:hover {
            cursor : pointer;
        }
    }
    img {
            width : 32px;
            height: 32px;
            border-radius : 50%;

        &:hover {
            cursor : pointer;
        }
    }

    .flexDiv { 
        display : flex;
        align-items : center;
    }

    .nickname {
            display : flex;
            align-items : center;
            margin-right : 10px;
    }
    
    .moment {
        background-color : #777;
            font-weight :200;
            color :  white;
            margin-right : 5px;


        &:hover {
            cursor : initial;
        }
    }
`

const PostPageSubInfo = ({ post }) => {
    const dispatch = useDispatch();

    const onClickMyInfo = useCallback(() => {
        dispatch({
            type : COVER_POST,
            id : post?.UserId
        })
    },[post])    
    

    return (
            <DivContainer>
    <div className="flexDiv">
            <p className="moment">{moment(post?.createdAt).fromNow()}</p>
            <p className="nickname" onClick={onClickMyInfo}>{post?.User?.nickname}</p>
            <img onClick={onClickMyInfo} src={`http://localhost:3055/${post?.User?.Images[0]?.src}`}/>
    </div>
            </DivContainer>
    )
}

export default PostPageSubInfo
