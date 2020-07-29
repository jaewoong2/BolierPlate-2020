import React, { useState, useEffect } from 'react'
import CommentInput from './CommentInput'
import styled from 'styled-components'
import moment from 'moment';
import useSWR from 'swr';
import axios from 'axios';
import CommentPagination from './CommentPagination';
const StyledDivWrapper = styled.div`
    
    display : flex;
    justify-content : center;

    img {
        width : 24px;
        height : 24px;
        border-radius : 50%;
        margin-right : 10px;
    }

    span {
        font-size : 10px;
        color : #c95757c0;
        cursor : pointer;
        float : right;
    }
    
    .commentWrapper {
        width : 75%;
    }

    .commentDiv {
        width : 100%;
    }
    .day {
        width : 100%;
        border-bottom : 1px solid black; 
        padding-bottom : 3px;
        margin-bottom : 11px;
    }
`
// const fetcher = (url) => axios.get(url, {withCredentials  : true }).then(res => res.data);

const CommentContainer = ({user, post}) => {
    const [number, setNumber] = useState(0);
    // const { data : commentData, error : commentError } = useSWR(`http://localhost:3055/comment/${post?.id}?lastId=${number}`, fetcher);
    
    return (
        <>
        <CommentPagination comment={post.Comments} number={number} setNumber={setNumber}/>
        <StyledDivWrapper>
            <div className="commentWrapper">
            {post.Comments?.map((v, i) => (5 * number <= i && 5 * (number + 1) > i) && (
                <>
                <div>
                    <img src={`http://localhost:3055/${v?.User?.Images[0]?.src}`} />
                    {v?.User?.nickname}
                    {v?.User?.id === user.id && <span>{' 삭제'}</span>}
                </div>
            <div className="commentDiv">
                <pre className="comment">- {v.content}</pre>
            </div>
            <div className="day">{moment(post?.createdAt).format('YYYY.MM.DD')}</div>
            </>
            )
        )}
            </div>
        </StyledDivWrapper>
            {user.id && <CommentInput user={user} postid={post?.id}/>}
        </>
    )
}

export default CommentContainer
