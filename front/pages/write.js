import React, { useEffect } from 'react'
import Editor from '../components/Edit/Editor'
import MyLayout from '../components/MyLayout'
import { useSelector } from 'react-redux'
import Router, { useRouter } from 'next/router'
import useSWR  from 'swr';
import axios from 'axios';
import wrapper from '../store/configureStore'
import { END } from 'redux-saga';
import { LOAD_MYINFO_REQUEST } from '../reducer/user'
import styled from 'styled-components'

const fetcher = (url) => axios.get(url, { withCredentials: true })
    .then((result) => result.data);

const ErrorDiv = styled.div`
    display : flex;
    justify-content : center;
    font-size : 40px;
`

const write = () => {
    const { wrtieLoading, wrtieDone } = useSelector(state => state.post);
    const { loginInfo } = useSelector(state => state.user);
    const router = useRouter();
    const { data, error } = useSWR(`http://localhost:3055/post/${router.query.PostId}`, fetcher);

    if(data && data?.UserId !== loginInfo.id) {
        return  <MyLayout><ErrorDiv>접근되지 않는 유저..</ErrorDiv></MyLayout>
    }
 
    return (
        <MyLayout>
            {router.query.PostId ? <Editor data={data}/> :<Editor /> }
            {/* 수정으로 들어왔으면 쿼리 PostId가 있다 */}
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
        type: LOAD_MYINFO_REQUEST,
    });
    context.store.dispatch(END); // dispatch가 끝나는것을 기다려줌
    await context.store.sagaTask.toPromise(); // saga 서버사이드를 위해서
  }); // 이부분이 home 보다 먼저 시작된다
  

export default write
