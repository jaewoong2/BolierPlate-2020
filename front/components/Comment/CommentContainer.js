import React, { useState, useEffect, useCallback } from 'react'
import CommentInput from './CommentInput'
import styled from 'styled-components'
import moment from 'moment';
import useSWR from 'swr';
import axios from 'axios';
import CommentPagination from './CommentPagination';
import { useSelector, useDispatch } from 'react-redux';
import { COVER_POST } from '../../reducer/post';
import CommentCotent from './CommentCotent';
const StyledDivWrapper = styled.div`
    
    display : flex;
    justify-content : center;

    img {
        width : 24px;
        height : 24px;
        border-radius : 50%;
        margin-right : 10px;
        cursor : pointer;
    }

    span { 
        cursor : pointer;
    }

    .delete {
        font-size : 10px;
        color : #c95757c0;
        cursor : pointer;
        float : right;
    }
    
    .commentWrapper {
        width : 75%;
    }
    
    .comments {
        .imgspan{
            border-left : 4px solid #888;
            padding-left : 4px;
        }

        .commentDiv {
            width : 100%;
            padding-left : 4px;
            border-left : 4px solid #888;
        }
        .day {
            width : 100%;
            padding-bottom : 3px;
            margin-bottom : 11px;
            /* border-bottom : 1px solid black;  */
            .down {
                font-size : 10px;
                color : #212bb8c2;
            }
            .recommentbtn {
                margin-left : 5px;
                font-size : 12px;
                color : #777;
                cursor : pointer;
            }
        }
        
        .reply {
            background-color : #f1a1a183;
            border-radius : 10px 10px 0px 0px;
        }
        
        .replycontent {
            width : 95%;
            margin-left : 5%;
        }
    }
    

`

const CommentContainer = ({user, post}) => {
    const [number, setNumber] = useState(0);
    
    return (
        <div>
        <CommentPagination comment={post.Comments} number={number} setNumber={setNumber}/>
        {user.id && <CommentInput user={user} postid={post?.id}/>}
        <StyledDivWrapper>
            <div className="commentWrapper">
            {post.Comments?.map((v, i) => (5 * number <= i && 5 * (number + 1) > i) && !v.CommentId && (
                <div className="comments">
              <CommentCotent comment={v} user={user}/>
                </div>
            )
        )}
            </div>
        </StyledDivWrapper>
        </div>
    )
}

export default CommentContainer
