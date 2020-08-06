import React, { useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Typography, message } from 'antd'
import { EyeOutlined, HeartTwoTone } from '@ant-design/icons'
import { HASHTAG_SEARCH_REQUEST, DELETE_POST_REQUEST, UNLIKE_POST_REQUEST, LIKE_POST_REQUEST } from '../../reducer/post'
import { useDispatch, useSelector } from 'react-redux'
import Router ,{ useRouter } from 'next/router'
    
const StyledDivEditContainer = styled.div`
        display : flex;
        width : 100%;
        justify-content : space-between;

        .flexdiv {
            display : flex;
            align-items : center;
        }
`

const DivEditOne = styled.div`
display : flex; 
color : #777;

margin : 10px 5vw 0px 4vw;
justify-content : flex-start;
`

const StyledTags = styled(Typography.Text)`
    font-size : 12px;

    &:hover {
        cursor: pointer;
        color : #4e91cf;
    }

`

const DivEdit = styled.div`
    display : flex; 
    color : #777;

    justify-content : flex-end;
    margin : 10px 10px 0px 0px;

 .tagging {
    justify-content : flex-start;
    margin-left : 10vw;
    }

 p {
     cursor: pointer;
     margin : 2px;
 }
`
const ViewDiv = styled.div`
    display : flex;
    margin-top : 10px;
    margin-left : 3px;
    align-items : center;

    .viewicon {
        display : flex;
        align-items : center;
        font-size : 17px;
        margin-left : 5px;
    }
    span {
        font-size : 18px;
        margin-right : 3px;
        font-style : italic;
    }
`


const LikeDiv = styled.div`
    display : flex;
    margin-top : 10px;
    margin-right : 5vw;

    .heart {    
        display : flex;
        align-items : center;
        font-size : 17px;
        margin-left : 5px;
    }    

    span {
        margin-right : 10px;
        font-size : 18px;
        font-style : italic;
    }
`

const PostPageTagLike = ({ post }) => {
    const dispatch = useDispatch();
    const { loginInfo } = useSelector(state => state.user);
    const router = useRouter();
    const [liker, setLiker] = useState({})

    useEffect(() => {
        setLiker(post?.Likers?.map(liker => liker?.id === loginInfo?.id ? liker : false).filter(v => v !== false)[0]);
    },[post, loginInfo])



    const onClickLike = useCallback(() => {
        if(!loginInfo.id) {
          return message.warn('로그인 후 이용 가능합니다')
        } else {
          !liker && dispatch({
            type : LIKE_POST_REQUEST,
            id : post?.id
          });
          liker && dispatch({
            type : UNLIKE_POST_REQUEST,
            id : post?.id
          })
        }
      },[liker, post, loginInfo]);

      const deletePost = useCallback((id) => () => {
        dispatch({
          type : DELETE_POST_REQUEST,
          data : {
            id
          }
        })
      },[])
    

    const searchHashtag = useCallback((tag) => () => {
        dispatch({
            type : HASHTAG_SEARCH_REQUEST,
            data : {
                name : encodeURIComponent(tag)
            }
        })
        router.pathname.slice(1) && Router.replace('/')
    },[])


    return (
        <StyledDivEditContainer>
            <DivEditOne>
                {post?.Hashtags?.map(tag => <StyledTags onClick={searchHashtag(tag?.name)} keyboard>{tag?.name}</StyledTags>)}
            </DivEditOne>
            <div className="flexdiv">
                {post?.UserId === loginInfo?.id && 
                <DivEdit>
                    <p onClick={() => Router.replace(`/write?PostId=${parseInt(post.id, 10)}`)}>수정</p>
                    <p>/</p>
                    <p onClick={deletePost(post?.id)}>삭제</p>
                </DivEdit>}
                
                <ViewDiv>
                <EyeOutlined className="viewicon"/>
                <span>{post?.Views?.length}</span>
                </ViewDiv>


                <LikeDiv>
                <HeartTwoTone onClick={onClickLike} className="heart" twoToneColor={liker?.id ? 'red' : 'gray'} />
                <span>{post?.Likers?.length}</span>
                </LikeDiv>
            </div>
        </StyledDivEditContainer>
    )
}

export default PostPageTagLike
