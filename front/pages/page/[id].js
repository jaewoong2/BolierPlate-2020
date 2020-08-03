import React, { useEffect, useCallback, useMemo, useState } from 'react'
import Router, { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import MyLayout from '../../components/MyLayout';
import moment from 'moment';
import 'moment/locale/ko'
import styled from 'styled-components';
import { message, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DELETE_POST_REQUEST, HASHTAG_SEARCH_REQUEST, COVER_POST, LOAD_ONE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, LOAD_POSTS_REQUEST } from '../../reducer/post';
import { LOAD_MYINFO_REQUEST } from '../../reducer/user';
import { HeartTwoTone, HeartOutlined, EyeOutlined } from '@ant-design/icons';
import CommentInput from '../../components/Comment/CommentInput';
import CommentContainer from '../../components/Comment/CommentContainer';
import { END } from 'redux-saga';
import wrapper from '../../store/configureStore'


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

const Containertitle = styled.div`
    display : flex;
    margin-left : 9%;
    overflow : auto;
    h1 { 
        font-size : 40px;
        margin : 0;
    }
`

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
        &:hover {
            cursor : pointer;
        }
    }
    .moment {
        &:hover {
            cursor : initial;
        }
    }
`

const BorderDiv = styled.div`
    display : flex;
    justify-content : center;
    width : 100%;

    .bode {
    border : 0;
    border-top : 1px solid #777;
    width : 80%;
    }

    h1 {
        font-size : 40px;
    }
`
const PostContent = styled.div`
  font-size: 1.0125rem;
  color: #434343;
  overflow : auto;
  padding-top : 3%;
  padding-left : 9%;
  padding-right : 9%;

  img {
      width :100%;
  }
`;



const QuillStyleDiv = styled.div`
    pre {
        background-color: #23241f;
        color: #f8f8f2;
        overflow: visible;
        white-space: pre-wrap;
        margin-bottom: 5px;
        margin-top: 5px;
        padding: 5px 10px;
        border-radius : 3px;
    }

    blockquote {
        border-left: 4px solid #ccc;
        margin-bottom: 5px;
        margin-top: 5px;
        padding-left: 16px;
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

moment.locale('ko')

const page = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;
    const { loginInfo } = useSelector((state) => state.user);
    const { CoverUp, onePost : data, loadPostsError, submitCommentDone, submitCommentLoding, deleteCommentDone, deleteCommentLoding } = useSelector((state) => state.post);

    const [liker, setLiker] = useState({})

    useEffect(() => {
        setLiker(data?.Likers?.map(liker => liker?.id === loginInfo?.id ? liker : false).filter(v => v !== false)[0]);
    },[data, loginInfo])


    useEffect(() => {
        dispatch({
            type : LOAD_ONE_POST_REQUEST,
            id 
        })
    },[loginInfo.id, submitCommentDone && !submitCommentLoding, deleteCommentDone && !deleteCommentLoding])

    useEffect(() => {
        if(data === null) {
            message.error('존재하지않는 게시물...')
            Router.back();
        }
    },[data])

    useEffect(() => {
        loadPostsError && (() => {
            message.error('에러 발생...');
            Router.back();
        })()
    },[loadPostsError])
    
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

    const onClickMyInfo = useCallback(() => {
        dispatch({
            type : COVER_POST,
            id : data?.UserId
        })
    },[data])    

    const onClickCoverDown = useCallback((e) => {
        CoverUp && dispatch({
            type : COVER_POST,
        })
    },[CoverUp])

    const onClickLike = useCallback(() => {
        if(!loginInfo.id) {
          return message.warn('로그인 후 이용 가능합니다')
        } else {
          !liker && dispatch({
            type : LIKE_POST_REQUEST,
            id : data?.id
          });
          liker && dispatch({
            type : UNLIKE_POST_REQUEST,
            id : data?.id
          })
        }
      },[liker, data, loginInfo]);


    
const flexDivMemo = useMemo(() => {
    return {
        display : 'flex',
        alignItems : 'center'
    }
})

const momentPMemo = useMemo(() => {
    return { 
        backgroundColor : '#777',
        fontWeight :'200',
        color : 'white',
        marginRight : '5px',
     }
})

const nicknamePMemo = useMemo(() => {
    return { 
        display : 'flex',
        alignItems : 'center',
        marginRight : '10px'
    }
})

const avatarImgMemo = useMemo(() => {
    return {
        width : "32px",
        height:'32px',
        borderRadius : '50%'
    }
})

const divEditContainerMemo = useMemo(() => {
    return {
        display : 'flex',
        width : '100%',
        justifyContent : 'space-between'
    }
})



    return (
        <MyLayout>
           {data?.id ? <div onClick={onClickCoverDown}>
            <Containertitle><h1>{data?.title}</h1></Containertitle>
            <DivContainer>
    <div style={flexDivMemo}>
            <p style={momentPMemo} className="moment">{moment(data?.createdAt).fromNow()}</p>
            <p onClick={onClickMyInfo} style={nicknamePMemo}>{data?.User?.nickname}</p>
            <img onClick={onClickMyInfo} style={avatarImgMemo}  src={`http://localhost:3055/${data?.User?.Images[0]?.src}`}/>
    </div>
            </DivContainer>
            <BorderDiv>
               <div className="bode"/>
            </BorderDiv>
            <div style={divEditContainerMemo}>
            <DivEditOne>
                {data?.Hashtags?.map(v => <StyledTags onClick={searchHashtag(v?.name)} keyboard>{v?.name}</StyledTags>)}
            </DivEditOne>
            <div style={flexDivMemo}>
                {data?.UserId === loginInfo?.id && 
                <DivEdit>
                    <p onClick={() => Router.replace(`/write?PostId=${parseInt(data.id, 10)}`)}>수정</p>
                    <p>/</p>
                    <p onClick={deletePost(data?.id)}>삭제</p>
                </DivEdit>}
                <ViewDiv>
                <EyeOutlined className="viewicon"/>
                <span>{data?.Views?.length}</span>
                </ViewDiv>
                <LikeDiv>
                <HeartTwoTone onClick={onClickLike} className="heart" twoToneColor={liker?.id ? 'red' : 'gray'} />
                <span>{data?.Likers?.length}</span>
                </LikeDiv>
            </div>
            </div>
            <PostContent>
            <QuillStyleDiv dangerouslySetInnerHTML={{__html : data?.content}}/>
            </PostContent>
            <CommentContainer post={data} user={loginInfo}/>
            </div> : (<BorderDiv><h1>로딩중...</h1></BorderDiv>)}
        </MyLayout>
    )
}

export const getServerSideProps = wrapper.getServerSideProps( async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = ''; // 로그인 전에는 쿠키 제거
    //로그인이 공유되는 것을 주의해야함 (내 쿠키값이 한번 넣어지고 그게 저장되서)
    if(context.req && cookie) { // 로그인 하고나서는
        axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
        type: LOAD_ONE_POST_REQUEST,
        id : context.params.id,
    });
    context.store.dispatch({
        type: LOAD_MYINFO_REQUEST,
    });
    context.store.dispatch(END); // dispatch가 끝나는것을 기다려줌
    await context.store.sagaTask.toPromise(); // saga 서버사이드를 위해서
  }); // 이부분이 home 보다 먼저 시작된다
  

export default page;
