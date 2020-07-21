import React, { useEffect } from 'react'
import Router, { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import MyLayout from '../../components/MyLayout';
import moment from 'moment';
import 'moment/locale/ko'
import styled from 'styled-components';
import { message } from 'antd';

const Containertitle = styled.div`
    display : flex;
    margin-left : 9%;
    h1 { 
        margin : 0;
    }
`

const DivContainer = styled.div`
    display : flex;
    justify-content : space-between;
    padding-left : 5%;
    padding-right : 5%;
`

const PostContent = styled.div`
  font-size: 1.3125rem;
  color: #434343;
  overflow : auto;
  padding-top : 5%;
  padding-left : 9%;
  padding-right : 9%;
  
  img {
      width :100%;
  }
`;

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


moment.locale('ko')
const fetcher = (url) => axios.get(url, { withCredentials: true })
    .then((result) => result.data);

const page = () => {

    const router = useRouter();
    const { id } = router.query;
    const { data, error } = useSWR(`http://localhost:3055/post/${id}`, fetcher);

    useEffect(() => {
        if(data === null) {
                message.error('존재하지않는 게시물...')
                Router.back();
        }
        console.log(data)
    },[data, error])
    
    return (
        <MyLayout>
           {data ? <div>
            <Containertitle><h1 style={{ fontSize : '50px'}}>{data?.title}</h1></Containertitle>
            <DivContainer>
            <p style={{ backgroundColor : '#777', fontWeight :'200', color : 'white' }} className="moment">{moment(data?.createdAt).fromNow()}</p>
    <div style={{ display : 'flex'}}>
            <p style={{ display : 'flex', alignItems : 'center', marginRight : '10px'}}>{data?.User?.nickname}</p>
            <img style={{width : "32px", height:'32px', borderRadius : '50%' }}  src={`http://localhost:3055/${data?.User?.Images[0]?.src}`}/>
    </div>
            </DivContainer>
            <BorderDiv>
               <div className="bode"/>
            </BorderDiv>
            <PostContent>
            <QuillStyleDiv dangerouslySetInnerHTML={{__html : data?.content}}/>
            </PostContent>
            </div> : (<BorderDiv><h1>로딩중...</h1></BorderDiv>)}
        </MyLayout>
    )
}

export default page;
