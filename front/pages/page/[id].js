import React, { useEffect, useCallback, useMemo } from 'react'
import Router, { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import MyLayout from '../../components/MyLayout';
import moment from 'moment';
import 'moment/locale/ko'
import styled from 'styled-components';
import { message, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DELETE_POST_REQUEST, HASHTAG_SEARCH_REQUEST, COVER_POST } from '../../reducer/post';
import { LOAD_MYINFO_REQUEST } from '../../reducer/user';
import { HeartTwoTone, HeartOutlined } from '@ant-design/icons';

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
    margin : 10px 5vw 0px 0px;

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
const fetcher = (url) => axios.get(url, { withCredentials: true })
    .then((result) => result.data);

const page = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;
    const { data, error } = useSWR(`http://localhost:3055/post/${id}`, fetcher);
    const { loginInfo } = useSelector((state) => state.user);
    const { CoverUp } = useSelector((state) => state.post);

    useEffect(() => {
        dispatch({
            type : LOAD_MYINFO_REQUEST,
        })
    },[])


    useEffect(() => {
        if(data === null) {
                message.error('존재하지않는 게시물...')
                Router.back();
        }
    },[data, error])
    
  const deletePost = useCallback((id) => () => {
    dispatch({
      type : DELETE_POST_REQUEST,
      data : {
        id
      }
    })
  },[])

const flexDivMemo = useMemo(() => {
    return {
        display : 'flex'
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

    return (
        <MyLayout>
           {data ? <div onClick={onClickCoverDown}>
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
                {data?.Hashtags?.map(v => <StyledTags onClick={searchHashtag(v.name)} keyboard>{v.name}</StyledTags>)}
            </DivEditOne>
                {data?.UserId === loginInfo?.id && <DivEdit>
                    <p onClick={() => Router.replace(`/write?PostId=${parseInt(data.id, 10)}`)}>수정</p>
                    <p>/</p>
                    <p onClick={deletePost(data.id)}>삭제</p>
                </DivEdit>}
            </div>
            <PostContent>
            <QuillStyleDiv dangerouslySetInnerHTML={{__html : data?.content}}/>
            </PostContent>
            </div> : (<BorderDiv><h1>로딩중...</h1></BorderDiv>)}
        </MyLayout>
    )
}

export default page;
